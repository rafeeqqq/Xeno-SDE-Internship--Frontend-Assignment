import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
} from "@mui/material";
import axios from "axios";
import { message } from "antd";

// Helper function to format the data for the chart
const formatDataForChart = (data) => {
  return data.map((campaign) => ({
    name: campaign.name,
    audienceSize: campaign.audienceSize,
    totalSpending: campaign.totalSpending,
  }));
};

const CampaignHistory = ({ data, fetchData }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    audienceSize: 0,
    totalSpending: 0,
  });

  const chartData = formatDataForChart(data);

  // Handle opening the dialog
  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  // Handle closing the dialog
  const handleClose = () => {
    setOpenDialog(false);
  };

  // Handle input change for the form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCampaign((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle form submission (API call)
  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/campaigns",
        newCampaign
      );
      message.success("Campagin Created sucessfully");
      fetchData();
      setOpenDialog(false);
      // Optionally, you could trigger a re-fetch of the campaign data here
    } catch (error) {
      console.error("Error creating campaign:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Campaign History
      </h2>

      {/* Button to open the dialog */}

      {/* Display Campaigns in Card Format */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-around",
        }}
      >
        {data.map((campaign) => (
          <div
            key={campaign._id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              margin: "10px",
              padding: "15px",
              width: "300px",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h3>{campaign.name}</h3>
            <p>
              <strong>Description:</strong> {campaign.description}
            </p>
            <p>
              <strong>Start Date:</strong>{" "}
              {new Date(campaign.startDate).toLocaleDateString()}
            </p>
            <p>
              <strong>End Date:</strong>{" "}
              {new Date(campaign.endDate).toLocaleDateString()}
            </p>
            <p>
              <strong>Audience Size:</strong> {campaign.audienceSize}
            </p>
            <p>
              <strong>Total Spending:</strong> $
              {campaign.totalSpending.toFixed(2)}
            </p>
            <p>
              <strong>Created At:</strong>{" "}
              {new Date(campaign.createdAt).toLocaleString()}
            </p>
            <p>
              <strong>Updated At:</strong>{" "}
              {new Date(campaign.updatedAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <Button variant="contained" color="primary" onClick={handleClickOpen}>
          Create New Campaign
        </Button>
      </div>

      {/* Displaying Bar Chart */}
      <div style={{ marginTop: "40px", textAlign: "center" }}>
        <h3>Campaign Analysis</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="audienceSize" fill="#8884d8" name="Audience Size" />
            <Bar dataKey="totalSpending" fill="#82ca9d" name="Total Spending" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Dialog for Creating New Campaign */}
      <Dialog open={openDialog} onClose={handleClose}>
        <DialogTitle>Create New Campaign</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Campaign Name"
                fullWidth
                variant="outlined"
                name="name"
                value={newCampaign.name}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                fullWidth
                variant="outlined"
                name="description"
                value={newCampaign.description}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Start Date"
                fullWidth
                variant="outlined"
                type="date"
                name="startDate"
                value={newCampaign.startDate}
                onChange={handleInputChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="End Date"
                fullWidth
                variant="outlined"
                type="date"
                name="endDate"
                value={newCampaign.endDate}
                onChange={handleInputChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CampaignHistory;
