import React, { useState, useEffect, useRef } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Tabs,
  Tab,
  Box,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  ArcElement,
  Legend,
  PointElement,
  LineElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ArcElement,
  Tooltip,
  Legend,
  PointElement,
  LineElement
);

import CustomerData from "./CustomerData.jsx";
import CampaignHistory from "./CampaignHistory";
import AudienceSegments from "./AudienceSegments";
import SendMessage from "./SendMessage";

const Dashboard = () => {
  const [customers, setCustomers] = useState([]);
  const [campaignHistory, setCampaignHistory] = useState([]);
  const [audienceSegments, setAudienceSegments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState(0);
  const [lowThreshold, setLowThreshold] = useState(2000); // Default to 500 for Low Spenders
  const [highThreshold, setHighThreshold] = useState(500); // Default to 500 for High Spenders
  const chartRef = useRef(null);
  console.log(customers);
  console.log(campaignHistory);

  const fetchData = async () => {
    const token = localStorage.getItem("token");

    try {
      const customersResponse = await fetch(
        "http://localhost:5000/api/customers",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const customersData = await customersResponse.json();
      setCustomers(customersData);

      // Segregating customers into "Low Spenders" and "High Spenders"
      const lowSpenders = customersData.filter(
        (customer) => customer.totalSpending <= lowThreshold
      );
      const highSpenders = customersData.filter(
        (customer) => customer.totalSpending > highThreshold
      );

      setAudienceSegments([
        {
          name: "Low Spenders",
          size: lowSpenders.length,
          customers: lowSpenders,
        },
        {
          name: "High Spenders",
          size: highSpenders.length,
          customers: highSpenders,
        },
      ]);

      const campaignsResponse = await fetch(
        "http://localhost:5000/api/campaigns",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const campaignsData = await campaignsResponse.json();
      setCampaignHistory(campaignsData.campaigns);

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const campaignData = {
    labels: campaignHistory.map((campaign) => campaign.name),
    datasets: [
      {
        label: "Audience Size",
        data: campaignHistory.map((campaign) => campaign.audienceSize),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const campaignBudgetData = {
    labels: campaignHistory.map((campaign) => campaign.name),
    datasets: [
      {
        label: "Total Spending",
        data: campaignHistory.map((campaign) => campaign.totalSpending),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const customerSpendingData = {
    labels: customers.map((customer) => customer.name),
    datasets: [
      {
        label: "Total Spending",
        data: customers.map((customer) => customer.totalSpending),
        fill: false,
        borderColor: "rgba(54, 162, 235, 1)",
        tension: 0.1,
      },
    ],
  };

  const customerCountData = {
    labels: audienceSegments.map((segment) => segment.name),
    datasets: [
      {
        label: "Customer Count",
        data: audienceSegments.map((segment) => segment.customers.length), // Count of customers
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
  };

  const formatDate = (date) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  const calculateAverageVisits = (campaignHistory) => {
    const totalVisits = campaignHistory.reduce((sum, campaign) => {
      const visits = campaign.audienceSize || 0;
      return sum + visits;
    }, 0);
    return totalVisits / campaignHistory.length || 0;
  };

  const calculateTotalAudienceSize = (campaignHistory) => {
    return campaignHistory.reduce(
      (sum, campaign) => sum + campaign.audienceSize,
      0
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("token");

    window.location.href = "/login";
  };

  const handleTabChange = (e, newValue) => {
    if (newValue === 5) {
      // If the "Logout" tab is selected
      handleLogout();
    } else {
      setSelectedTab(newValue);
    }
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" style={{ flexGrow: 1 }}>
            Xeno CRM & Campaign Management
          </Typography>
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            textColor="inherit"
            indicatorColor="secondary"
          >
            <Tab label="Dashboard" />
            <Tab label="Customer Data" />
            <Tab label="Campaign History" />
            <Tab label="Audience Segments" />
            <Tab label="Send Message" />
            <Tab label="Logout" />
          </Tabs>
        </Toolbar>
      </AppBar>

      <Box p={3}>
        {selectedTab === 0 && (
          <Grid>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Dashboard Overview
                </Typography>
                <Typography variant="body1">
                  <strong>Total Customers:</strong> {customers.length}
                </Typography>
                <Typography variant="body1">
                  <strong>Total Spend:</strong> $
                  {customers
                    .reduce(
                      (total, customer) => total + customer.totalSpending,
                      0
                    )
                    .toFixed(2)}
                </Typography>
                <Typography variant="body1">
                  <strong>Last Visit (Most Recent):</strong>{" "}
                  {customers.length
                    ? formatDate(customers[0].lastVisit)
                    : "N/A"}
                </Typography>
              </CardContent>
            </Card>
            <Divider />
            <Grid container spacing={3}>
              {/* Campaign History */}
              <Grid item xs={12} sm={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Campaign History
                    </Typography>
                    <Typography variant="body1">
                      <strong>Total Campaigns:</strong> {campaignHistory.length}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Average Visits:</strong>{" "}
                      {calculateAverageVisits(campaignHistory)}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Total Audience Size:</strong>{" "}
                      {calculateTotalAudienceSize(campaignHistory)}
                    </Typography>
                    <Line data={campaignData} />
                  </CardContent>
                </Card>
              </Grid>
              {/* Campaign Budget */}
              <Grid item xs={12} sm={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Campaign Budget
                    </Typography>
                    <Typography variant="body1">
                      <strong>Total Budget:</strong> $
                      {campaignHistory
                        .reduce(
                          (total, campaign) => total + campaign.totalSpending,
                          0
                        )
                        .toFixed(2)}
                    </Typography>
                    <Line data={campaignBudgetData} />
                  </CardContent>
                </Card>
              </Grid>
              {/* Customer Spending */}
              <Grid item xs={12} sm={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Customer Spending
                    </Typography>
                    <Line data={customerSpendingData} />
                  </CardContent>
                </Card>
              </Grid>
              {/* Audience Segments */}
              <Grid item xs={12} sm={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Audience Segments
                    </Typography>
                    <Pie
                      data={customerCountData}
                      style={{
                        maxHeight: "27.5rem",
                      }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        )}

        {selectedTab === 1 && (
          <CustomerData
            data={customers}
            campagindata={campaignHistory}
            fetchData={fetchData}
          />
        )}
        {selectedTab === 2 && <CampaignHistory data={campaignHistory} />}
        {selectedTab === 3 && <AudienceSegments data={customers} />}
        {selectedTab === 4 && <SendMessage />}
      </Box>
    </div>
  );
};

export default Dashboard;
