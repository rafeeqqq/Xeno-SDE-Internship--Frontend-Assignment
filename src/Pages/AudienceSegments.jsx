import React, { useState } from "react";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import {
  TextField,
  Button,
  Grid,
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";

// Registering ChartJS components
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale
);

const AudienceSegments = ({ data }) => {
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    totalSpending: "",
    totalSpendingComparison: "", // 'greater' or 'less'
    campaignName: "",
    audienceSize: "",
  });

  const [campaigns, setCampaigns] = useState([]);

  // Get unique campaign names
  useState(() => {
    const campaignNames = [
      ...new Set(data.map((item) => item.campaignId.name)),
    ];
    setCampaigns(campaignNames);
  }, [data]);

  // Function to handle filter input changes
  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  // Function to apply filters to the data
  const applyFilters = () => {
    return data.filter((item) => {
      const {
        name,
        email,
        phoneNumber,
        totalSpending,
        totalSpendingComparison,
        campaignName,
        audienceSize,
      } = filters;

      // Filter logic based on each criteria
      return (
        (name ? item.name.toLowerCase().includes(name.toLowerCase()) : true) &&
        (email
          ? item.email.toLowerCase().includes(email.toLowerCase())
          : true) &&
        (phoneNumber ? item.phoneNumber.includes(phoneNumber) : true) &&
        (totalSpending
          ? totalSpendingComparison === "greater"
            ? item.totalSpending > parseFloat(totalSpending)
            : item.totalSpending < parseFloat(totalSpending)
          : true) &&
        (campaignName
          ? item.campaignId.name
              .toLowerCase()
              .includes(campaignName.toLowerCase())
          : true) &&
        (audienceSize
          ? item.campaignId.audienceSize > parseInt(audienceSize)
          : true)
      );
    });
  };

  // Render filtered data
  const filteredData = applyFilters();

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Audience Segments
      </Typography>

      <Typography variant="h6" gutterBottom>
        Filtered Data Length: {filteredData.length}
      </Typography>

      <Grid container spacing={2}>
        {/* Filter Inputs */}

        {/* Total Spending Filter */}
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Total Spending"
            name="totalSpending"
            value={filters.totalSpending}
            onChange={handleFilterChange}
            fullWidth
            margin="normal"
            type="number"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Spending Comparison</InputLabel>
            <Select
              label="Spending Comparison"
              name="totalSpendingComparison"
              value={filters.totalSpendingComparison}
              onChange={handleFilterChange}
            >
              <MenuItem value="greater">Greater Than</MenuItem>
              <MenuItem value="less">Less Than</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Campaign Dropdown */}
        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Campaign Name</InputLabel>
            <Select
              label="Campaign Name"
              name="campaignName"
              value={filters.campaignName}
              onChange={handleFilterChange}
            >
              <MenuItem value="">All Campaigns</MenuItem>
              {campaigns.map((campaign) => (
                <MenuItem key={campaign} value={campaign}>
                  {campaign}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Box sx={{ marginTop: 3 }}>
        <Typography variant="h5" gutterBottom>
          Filtered Audience
        </Typography>
        <Grid container spacing={2}>
          {filteredData.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ marginBottom: 2 }}>
                <CardContent>
                  <Typography variant="h6">{item.name}</Typography>
                  <List>
                    <ListItem>
                      <ListItemText primary="Email" secondary={item.email} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Phone" secondary={item.phone} />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Total Spending"
                        secondary={`$${item.totalSpending}`}
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default AudienceSegments;
