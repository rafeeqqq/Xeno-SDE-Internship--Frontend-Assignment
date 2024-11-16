import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import axios from "axios";
import { message } from "antd";

const SendMessage = () => {
  const [messageContent, setMessageContent] = useState("");
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [customers, setCustomers] = useState([]);
  const [messages, setMessages] = useState([]); // Renamed to avoid confusion
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [sentMessage, setSentMessage] = useState(null);
  const token = localStorage.getItem("token");

  // Fetch campaigns from API
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await axios.get(
          "https://xeno-sde-internship-assignment.onrender.com/api/campaigns",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCampaigns(response.data.campaigns);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
        message.error("Failed to fetch campaigns.");
      }
    };
    fetchCampaigns();
  }, []);

  // Fetch customers from API
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get(
          "https://xeno-sde-internship-assignment.onrender.com/api/customers",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCustomers(response.data);
      } catch (error) {
        console.error("Error fetching customers:", error);
        message.error("Failed to fetch customers.");
      }
    };
    fetchCustomers();
  }, []);

  // Filter customers based on the selected campaign
  useEffect(() => {
    if (selectedCampaign) {
      const filtered = customers.filter(
        (customer) => customer.campaignId._id === selectedCampaign
      );
      setFilteredCustomers(filtered);
    } else {
      setFilteredCustomers(customers);
    }
  }, [selectedCampaign, customers]);

  // Fetch previous messages after sending a new one
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          "https://xeno-sde-internship-assignment.onrender.com/api/communicationLogs",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching communication logs:", error);
        message.error("Failed to fetch communication logs.");
      }
    };
    fetchMessages();
  }, [sentMessage]); // Trigger re-fetch when a message is sent

  // Handle message send
  const handleSendMessage = async () => {
    if (!messageContent) {
      message.error("Please enter a message to send.");
      return;
    }

    try {
      const response = await axios.post(
        "https://xeno-sde-internship-assignment.onrender.com/api/communicationLogs",

        {
          campaignId: selectedCampaign,
          message: messageContent,
          customers: filteredCustomers.map((customer) => customer._id),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      message.success("Message sent successfully!");
      setSentMessage({
        message: messageContent,
        customerCount: filteredCustomers.length,
        customers: filteredCustomers,
      });
      setMessageContent(""); // Clear the message input
      setSelectedCampaign(""); // Clear the selected campaign
    } catch (error) {
      console.error("Error sending message:", error);
      message.error("Failed to send message. Please try again.");
    }
  };

  return (
    <Grid container spacing={3}>
      {/* Campaign selection and message input */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Send Message
            </Typography>
            <Typography>
              Here, you can send messages to customers associated with the
              selected campaign.
            </Typography>
            <FormControl fullWidth margin="normal">
              <InputLabel>Campaign</InputLabel>
              <Select
                value={selectedCampaign}
                onChange={(e) => setSelectedCampaign(e.target.value)}
                label="Campaign"
              >
                {campaigns.map((campaign) => (
                  <MenuItem key={campaign._id} value={campaign._id}>
                    {campaign.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Message"
              fullWidth
              multiline
              rows={4}
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              margin="normal"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSendMessage}
              disabled={!selectedCampaign || !messageContent}
            >
              Send Message
            </Button>
          </CardContent>
        </Card>
      </Grid>

      {/* Customer Cards */}
      {filteredCustomers.length > 0 && (
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Customers Associated with Campaign - {filteredCustomers.length}{" "}
            Customers
          </Typography>
          <Grid container spacing={2}>
            {filteredCustomers.map((customer) => (
              <Grid item xs={12} sm={6} md={4} key={customer._id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{customer.name}</Typography>
                    <Typography variant="body2">
                      Email: {customer.email} | Phone: {customer.phone}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      )}

      {/* Display Previous Messages */}
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Previous Messages - {messages.length} sent
        </Typography>
        <Grid container spacing={2}>
          {messages.map((msg) => (
            <Grid item xs={12} sm={6} md={4} key={msg._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">
                    Campaign: {msg.campaignId.name}
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    Message: {msg.message}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Sent to {msg.customerIds.length} customers.
                  </Typography>
                  {msg.customerIds.map((customer) => (
                    <Typography
                      key={customer._id}
                      variant="body2"
                      color="textSecondary"
                    >
                      {customer.name} ({customer.email})
                    </Typography>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default SendMessage;
