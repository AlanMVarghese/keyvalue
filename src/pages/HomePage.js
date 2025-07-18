import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
`;

const Hero = styled.div`
  margin: 4rem 0;
  padding: 2rem;
  border-radius: 8px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
`;

const Title = styled.h1`
  font-size: 3rem;
  color: #2c3e50;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  color: #6c757d;
  margin-bottom: 2rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin: 2rem 0;
`;

const PrimaryButton = styled(Link)`
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: #4a90e2;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-weight: 500;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #357abd;
    color: white;
  }
`;

const SecondaryButton = styled(Link)`
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: white;
  color: #4a90e2;
  border: 1px solid #4a90e2;
  text-decoration: none;
  border-radius: 4px;
  font-weight: 500;
  transition: all 0.2s;
  
  &:hover {
    background-color: #f8f9fa;
    color: #357abd;
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 8px;
  padding: 2rem;
  margin: 2rem 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: left;
  
  h2 {
    color: #2c3e50;
    margin-top: 0;
  }
  
  p {
    color: #6c757d;
    line-height: 1.6;
  }
`;

export default function HomePage() {
  return (
    <Container>
      <Hero>
        <Title>CanteenMate</Title>
        <Subtitle>Your digital canteen management solution</Subtitle>
        
        <ButtonGroup>
          <PrimaryButton to="/login?role=student">Student Login</PrimaryButton>
          <SecondaryButton to="/login?role=canteen_owner">Canteen Owner Login</SecondaryButton>
        </ButtonGroup>
      </Hero>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', margin: '4rem 0' }}>
        <Card>
          <h2>For Students</h2>
          <p>Browse the menu, place orders, and track your order status in real-time. No more waiting in long queues!</p>
          <p>
            <Link to="/register?role=student">Create a student account</Link>
          </p>
        </Card>
        
        <Card>
          <h2>For Canteen Owners</h2>
          <p>Manage orders, update menu items, and track your canteen's performance all in one place.</p>
          <p>
            <Link to="/register?role=canteen_owner">Register your canteen</Link>
          </p>
        </Card>
      </div>
    </Container>
  );
}
