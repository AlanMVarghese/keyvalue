import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { toast } from "react-toastify";
import styled from "styled-components";
import { format } from 'date-fns';

// Styled Components
const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const RefreshButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #357abd;
  }
  
  &:disabled {
    background-color: #a0c4ff;
    cursor: not-allowed;
  }
`;

const LogoutButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #bb2d3b;
  }
`;

const ErrorMessage = styled.div`
  background-color: #f8d7da;
  color: #721c24;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1.5rem;
  border: 1px solid #f5c6cb;
`;

const NoOrders = styled.div`
  text-align: center;
  padding: 2rem;
  background-color: #f8f9fa;
  border-radius: 4px;
  color: #6c757d;
`;

const OrderGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
`;

const OrderCard = styled.div`
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e9ecef;
  margin-bottom: 0.5rem;
`;

const OrderId = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  color: #343a40;
`;

const OrderInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
`;

const InfoLabel = styled.span`
  font-weight: 500;
  color: #6c757d;
`;

const InfoValue = styled.span`
  color: #343a40;
`;

const OrderSection = styled.div`
  margin: 0.5rem 0;
`;

const SectionTitle = styled.h4`
  margin: 0 0 0.5rem 0;
  font-size: 0.95rem;
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
  border-bottom: 1px dashed #e9ecef;
  
  &:last-child {
    border-bottom: none;
  }
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
  margin-top: 0.5rem;
  padding-top: 0.75rem;
  border-top: 2px solid #e9ecef;
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

const StatusUpdate = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e9ecef;
`;

const StatusLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #495057;
`;

const StatusSelect = styled.select`
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 0.95rem;
  background-color: ${props => ({
    pending: '#fff3bf',
    preparing: '#d0ebff',
    ready: '#d3f9d8',
    completed: '#d8f5a2',
    cancelled: '#ffd8a8'
  }[props.$status] || '#fff')};
  
  &:focus {
    border-color: #80bdff;
    outline: none;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
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

const CanteenOwnerDashboard = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      
      if (!token || role !== 'canteen_owner') {
        navigate('/login');
        return;
      }
      
      await fetchOrders();
    };
    
    loadData();
  }, [navigate]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await API.get('/orders');
      setOrders(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      const errorMessage = error.response?.data?.message || "Failed to load orders. Please try again later.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await API.put(`/orders/${orderId}/status`, { status: newStatus });
      
      if (response.data && response.data.success) {
        // Update local state
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
        toast.success(`Order status updated to ${newStatus}`);
      } else {
        throw new Error(response.data?.message || 'Failed to update status');
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      const errorMessage = error.response?.data?.message || "Failed to update order status";
      toast.error(errorMessage);
      
      // Refresh orders to ensure we have the latest state
      fetchOrders();
    }
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const handleRefresh = () => {
    fetchOrders();
  };

  if (isLoading) {
    return (
      <DashboardContainer>
        <h1>Canteen Owner Dashboard</h1>
        <p>Loading orders...</p>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <Header>
        <h1>Canteen Owner Dashboard</h1>
        <ButtonGroup>
          <RefreshButton onClick={handleRefresh} disabled={isRefreshing}>
            {isRefreshing ? 'Refreshing...' : 'Refresh Orders'}
          </RefreshButton>
          <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
        </ButtonGroup>
      </Header>
      
      <h2>All Orders</h2>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      {orders.length === 0 ? (
        <NoOrders>No orders found</NoOrders>
      ) : (
        <OrderGrid>
          {orders.map((order) => (
            <OrderCard key={order._id}>
              <OrderHeader>
                <OrderId>Order #{order._id.slice(-6).toUpperCase()}</OrderId>
                <StatusBadge $status={order.status}>{order.status}</StatusBadge>
              </OrderHeader>
              
              <OrderInfo>
                <InfoItem>
                  <InfoLabel>Student:</InfoLabel>
                  <InfoValue>{order.studentName || 'N/A'}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Date:</InfoLabel>
                  <InfoValue>
                    {order.orderedAt 
                      ? format(new Date(order.orderedAt), 'MMM d, yyyy h:mm a') 
                      : 'N/A'}
                  </InfoValue>
                </InfoItem>
              </OrderInfo>
              
              <OrderSection>
                <SectionTitle>Items:</SectionTitle>
                <ItemsList>
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item, index) => (
                      <Item key={index}>
                        <ItemName>{item.quantity}x {item.itemName}</ItemName>
                        <ItemPrice>₹{(item.price * item.quantity).toFixed(2)}</ItemPrice>
                      </Item>
                    ))
                  ) : (
                    <NoItems>No items in this order</NoItems>
                  )}
                </ItemsList>
              </OrderSection>
              
              <OrderTotal>
                <TotalLabel>Total:</TotalLabel>
                <TotalAmount>₹{order.total?.toFixed(2) || '0.00'}</TotalAmount>
              </OrderTotal>
              
              <StatusUpdate>
                <StatusLabel>Update Status:</StatusLabel>
                <StatusSelect 
                  value={order.status || 'pending'}
                  onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                  $status={order.status}
                >
                  <option value="pending">Pending</option>
                  <option value="preparing">Preparing</option>
                  <option value="ready">Ready for Pickup</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </StatusSelect>
              </StatusUpdate>
            </OrderCard>
          ))}
        </OrderGrid>
      )}
    </DashboardContainer>
  );
};

export default CanteenOwnerDashboard;
