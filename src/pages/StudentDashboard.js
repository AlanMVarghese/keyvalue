import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API from "../api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styled from "styled-components";

// Styled Components
const DashboardContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
`;

const Tabs = styled.div`
  display: flex;
  margin-bottom: 2rem;
  border-bottom: 1px solid #ddd;
`;

const Tab = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 1rem;
  color: ${(props) => (props.$active ? "#4a90e2" : "#666")};
  border-bottom: 2px solid ${(props) => (props.$active ? "#4a90e2" : "transparent")};
  transition: all 0.2s;

  &:hover {
    color: #4a90e2;
  }
`;

const MenuGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

// Order History Styles
const OrderHistoryContainer = styled.div`
  margin-top: 1.5rem;
`;

const SectionHeader = styled.h2`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #eee;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
  font-style: italic;
`;

const NoOrdersMessage = styled.div`
  text-align: center;
  padding: 2rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  color: #6c757d;
`;

const OrderList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const OrderCard = styled.div`
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
`;

const OrderId = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  color: #343a40;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  text-transform: capitalize;
  background-color: ${props => ({
    pending: '#fef3c7',
    preparing: '#dbeafe',
    ready: '#d1fae5',
    completed: '#e0f2fe',
    cancelled: '#fee2e2'
  }[props.$status] || '#f3f4f6')};
  color: ${props => ({
    pending: '#92400e',
    preparing: '#1e40af',
    ready: '#065f46',
    completed: '#075985',
    cancelled: '#991b1b'
  }[props.$status] || '#4b5563')};
`;

const OrderDate = styled.div`
  color: #6c757d;
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const OrderItems = styled.div`
  margin: 1rem 0;
`;

const ItemsLabel = styled.div`
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #495057;
`;

const ItemsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const Item = styled.li`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f1f3f5;
  
  &:last-child {
    border-bottom: none;
  }
`;

const ItemQuantity = styled.span`
  width: 2rem;
  color: #6c757d;
`;

const ItemName = styled.span`
  flex: 1;
`;

const ItemPrice = styled.span`
  font-weight: 500;
`;

const NoItems = styled.div`
  color: #6c757d;
  font-style: italic;
  padding: 0.5rem 0;
`;

const OrderTotal = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 2px solid #f1f3f5;
`;

const TotalLabel = styled.span`
  font-weight: 600;
  font-size: 1.1rem;
  color: #343a40;
`;

const TotalAmount = styled.span`
  font-weight: 700;
  font-size: 1.2rem;
  color: #2b8a3e;
`;

// Menu Item Styles
const MenuItem = styled.div`
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 1.5rem;
  transition: transform 0.2s, box-shadow 0.2s;
  background: white;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const Button = styled.button`
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 1rem;
  width: 100%;

  &:hover {
    background-color: #357abd;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  margin-top: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const OrderSummary = styled.div`
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin-top: 2rem;
`;

const OrderHistory = styled.div`
  margin-top: 2rem;
`;

const OrderItem = styled.div`
  background: white;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
`;

// Menu items
const MENU = [
  { 
    id: 1, 
    item: "Meals", 
    price: 40, 
    description: "Delicious full meal with rice, curry, and sides" 
  },
  { 
    id: 2, 
    item: "Chai", 
    price: 10, 
    description: "Hot and refreshing tea" 
  },
  { 
    id: 3, 
    item: "Snacks", 
    price: 20, 
    description: "Tasty snacks to munch on" 
  },
];

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [quantities, setQuantities] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [orderHistory, setOrderHistory] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [activeTab, setActiveTab] = useState('newOrder');
  const [userName, setUserName] = useState('');

  // Load user data and order history on component mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const name = localStorage.getItem("userName");
        
        if (!token) {
          navigate("/login");
          return;
        }
        
        setUserName(name || 'Student');
        await fetchOrderHistory();
      } catch (error) {
        console.error("Error loading user data:", error);
        toast.error("Failed to load user data. Please login again.");
        navigate("/login");
      }
    };

    const fetchOrderHistory = async () => {
      try {
        setIsLoadingHistory(true);
        const response = await API.get("/orders/my-orders");
        
        if (response.data && response.data.success) {
          setOrderHistory(Array.isArray(response.data.orders) ? response.data.orders : []);
        } else {
          throw new Error(response.data?.message || 'Failed to load order history');
        }
      } catch (error) {
        console.error("Error fetching order history:", error);
        // Only show error if it's not a 404 (not found) error
        if (error.response?.status !== 404) {
          const errorMessage = error.response?.data?.message || error.message || "Failed to load order history";
          toast.error(errorMessage);
        }
      } finally {
        setIsLoadingHistory(false);
      }
    };
    
    loadUserData();
  }, [navigate]);

  const handleQuantityChange = (item, value) => {
    const newValue = parseInt(value) || 0;
    if (newValue >= 0) {
      setQuantities(prev => ({
        ...prev,
        [item]: newValue
      }));
    }
  };

  const calculateTotal = () => {
    return MENU.reduce((total, menuItem) => {
      const quantity = quantities[menuItem.item] || 0;
      return total + (quantity * menuItem.price);
    }, 0);
  };

  const placeOrder = async () => {
    console.log('=== PLACE ORDER CLICKED ===');
    
    // Prevent multiple clicks while loading
    if (isLoading) {
      console.log('Order placement already in progress');
      return;
    }

    const selectedItems = MENU
      .filter(menu => quantities[menu.item] > 0)
      .map(menu => ({
        itemName: menu.item,
        quantity: quantities[menu.item],
        price: menu.price,
      }));

    if (selectedItems.length === 0) {
      toast.warning("Please select at least one item.");
      return;
    }

    const total = calculateTotal();
    
    try {
      console.log('=== STARTING ORDER PLACEMENT ===');
      console.log('Selected items:', selectedItems);
      console.log('Total:', total);
      
      setIsLoading(true);
      
      const orderData = { 
        items: selectedItems,
        total: parseFloat(total.toFixed(2))
      };
      
      console.log('=== SENDING ORDER DATA ===');
      console.log('Order data:', JSON.stringify(orderData, null, 2));
      
      // Test API connection first
      console.log('=== TESTING API CONNECTION ===');
      try {
        // Use the full URL to bypass the API baseURL for health check
        const healthCheck = await axios.get('http://localhost:5000/health');
        console.log('Health check response:', healthCheck.data);
      } catch (healthError) {
        console.error('Health check failed:', healthError);
        throw new Error('Cannot connect to server. Please check if the backend is running on port 5000.');
      }
      
      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        console.error('Request timed out after 10 seconds');
        controller.abort();
      }, 10000);
      
      console.log('=== SENDING ORDER REQUEST ===');
      const response = await API.post("/api/orders", orderData, { 
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      clearTimeout(timeoutId);
      
      console.log('=== ORDER RESPONSE RECEIVED ===');
      console.log('Response status:', response.status);
      console.log('Response data:', response.data);
      
      if (response.data && response.data.success) {
        console.log('Order placed successfully');
        toast.success("Order placed successfully!");
        setQuantities({});
        
        // Refresh order history
        try {
          console.log('=== REFRESHING ORDER HISTORY ===');
          const historyResponse = await API.get("/orders/my-orders");
          console.log('Order history after refresh:', historyResponse.data);
          
          if (historyResponse.data && Array.isArray(historyResponse.data.orders)) {
            setOrderHistory(historyResponse.data.orders);
          }
        } catch (historyError) {
          console.error("Error refreshing order history:", historyError);
          toast.error("Order placed but could not refresh history. Please refresh the page.");
        }
        
        // Switch to order history tab
        setActiveTab('orderHistory');
      } else {
        const errorMsg = response.data?.message || 'Failed to place order';
        console.error('Order placement failed with message:', errorMsg);
        throw new Error(errorMsg);
      }
      
    } catch (error) {
      console.error("=== ORDER PLACEMENT FAILED ===");
      console.error("Error details:", {
        name: error.name,
        message: error.message,
        code: error.code,
        response: error.response?.data,
        stack: error.stack
      });
      
      let errorMessage = "Failed to place order. Please try again.";
      
      if (error.name === 'AbortError') {
        errorMessage = "Request timed out. Please check your connection and try again.";
      } else if (error.response) {
        // Server responded with error status
        errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
      } else if (error.request) {
        // Request was made but no response received
        console.error('No response received. Request details:', error.request);
        errorMessage = "No response from server. Please check your connection.";
      } else if (error.message) {
        // Other errors
        errorMessage = error.message;
      }
      
      console.error('Displaying error to user:', errorMessage);
      toast.error(errorMessage);
    } finally {
      console.log('=== ORDER PLACEMENT PROCESS COMPLETED ===');
      setIsLoading(false);
    }
  };
  
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#f39c12';
      case 'preparing':
        return '#3498db';
      case 'ready':
        return '#2ecc71';
      case 'completed':
        return '#27ae60';
      case 'cancelled':
        return '#e74c3c';
      default:
        return '#7f8c8d';
    }
  };

  const renderNewOrderTab = () => (
    <>
      <h2>Welcome, {userName}!</h2>
      <p>Select items from the menu below to place your order.</p>
      
      <MenuGrid>
        {MENU.map((menu) => (
          <MenuItem key={menu.id}>
            <h3>{menu.item}</h3>
            <p style={{ color: '#666', margin: '0.5rem 0' }}>{menu.description}</p>
            <p style={{ fontWeight: 'bold', margin: '0.5rem 0' }}>₹{menu.price}</p>
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '1rem' }}>
              <label style={{ marginRight: '0.5rem' }}>Qty:</label>
              <Input
                type="number"
                min="0"
                placeholder="Qty"
                style={{ marginLeft: 10, width: '60px' }}
                value={quantities[menu.item] || 0}
                onChange={(e) => handleQuantityChange(menu.item, e.target.value)}
                disabled={isLoading}
              />
            </div>
          </MenuItem>
        ))}
      </MenuGrid>
      
      <OrderSummary>
        <h3>Order Summary</h3>
        {MENU.filter(menu => quantities[menu.item] > 0).map(menu => (
          <div key={menu.id} style={{ display: 'flex', justifyContent: 'space-between', margin: '0.5rem 0' }}>
            <span>{menu.item} x {quantities[menu.item]}</span>
            <span>₹{menu.price * quantities[menu.item]}</span>
          </div>
        ))}
        
        <div style={{ borderTop: '1px solid #ddd', margin: '1rem 0', paddingTop: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
            <span>Total:</span>
            <span>₹{calculateTotal()}</span>
          </div>
        </div>
        
        <Button 
          onClick={placeOrder} 
          disabled={isLoading || calculateTotal() === 0}
        >
          {isLoading ? 'Placing Order...' : 'Place Order'}
        </Button>
      </OrderSummary>
    </>
  );

  const renderOrderHistoryTab = () => (
    <OrderHistory>
      <h2>Your Order History</h2>
      {activeTab === 'orderHistory' && (
        <OrderHistoryContainer>
          <SectionHeader>Your Order History</SectionHeader>
          
          {isLoadingHistory ? (
            <LoadingMessage>Loading your orders...</LoadingMessage>
          ) : orderHistory.length === 0 ? (
            <NoOrdersMessage>You haven't placed any orders yet.</NoOrdersMessage>
          ) : (
            <OrderList>
              {orderHistory.map((order) => (
                <OrderCard key={order._id}>
                  <OrderHeader>
                    <OrderId>Order #{order._id.slice(-6).toUpperCase()}</OrderId>
                    <StatusBadge $status={order.status}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </StatusBadge>
                  </OrderHeader>
                  
                  <OrderDate>
                    {order.orderedAt 
                      ? new Date(order.orderedAt).toLocaleString() 
                      : 'Date not available'}
                  </OrderDate>
                  
                  <OrderItems>
                    <ItemsLabel>Items:</ItemsLabel>
                    {order.items && order.items.length > 0 ? (
                      <ItemsList>
                        {order.items.map((item, idx) => (
                          <Item key={idx}>
                            <ItemQuantity>{item.quantity}x</ItemQuantity>
                            <ItemName>{item.itemName}</ItemName>
                            <ItemPrice>₹{(item.price * item.quantity).toFixed(2)}</ItemPrice>
                          </Item>
                        ))}
                      </ItemsList>
                    ) : (
                      <NoItems>No items in this order</NoItems>
                    )}
                  </OrderItems>
                  
                  <OrderTotal>
                    <TotalLabel>Total:</TotalLabel>
                    <TotalAmount>₹{order.total?.toFixed(2) || '0.00'}</TotalAmount>
                  </OrderTotal>
                </OrderCard>
              ))}
            </OrderList>
          )}
        </OrderHistoryContainer>
      )}
    </OrderHistory>
  );

  return (
    <DashboardContainer>
      <Tabs>
        <Tab 
          $active={activeTab === 'newOrder'} 
          onClick={() => setActiveTab('newOrder')}
        >
          New Order
        </Tab>
        <Tab 
          $active={activeTab === 'orderHistory'} 
          onClick={() => setActiveTab('orderHistory')}
        >
          Order History
        </Tab>
      </Tabs>
      
      {activeTab === 'newOrder' ? renderNewOrderTab() : renderOrderHistoryTab()}
    </DashboardContainer>
  );
}
