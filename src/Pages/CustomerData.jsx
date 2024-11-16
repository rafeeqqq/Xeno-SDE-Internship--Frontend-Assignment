import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { message } from "antd"; // Ant Design's message component
import axios from "axios";

const CustomerData = ({ data, campagindata, fetchData }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openDialog, setOpenDialog] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    totalSpending: "",
    lastVisit: "",
    campaignId: "", // Empty initially, will be populated from dropdown
  });
  console.log(data);
  // Handle page changes
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle number of rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Open dialog
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  // Close dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer({
      ...newCustomer,
      [name]: value,
    });
  };
  console.log(newCustomer);
  const token = localStorage.getItem("token");
  console.log(token);
  const handleCreateCustomer = async () => {
    try {
      const response = await axios.post(
        "https://xeno-sde-internship-assignment.onrender.com/api/customers",
        newCustomer,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the headers here
          },
        }
      );

      console.log(response);
      if (!response.data.success) {
        throw new Error("Failed to create customer");
      }

      message.success("Customer created successfully!"); // Using Ant Design message
      fetchData();
      setOpenDialog(false);
    } catch (error) {
      message.error(error.message); // Using Ant Design message
    }
  };

  // If data is empty or undefined, return a message
  if (!Array.isArray(data) || data.length === 0) {
    return <Typography variant="h6">No data available</Typography>;
  }

  return (
    <Card>
      <CardContent>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "16px",
          }}
        >
          <Typography variant="h5" gutterBottom>
            Customers List - Total {data.length} Customers
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenDialog}
          >
            Add Customer
          </Button>
        </div>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Serial No.</TableCell>
              <TableCell>Item ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Campaign Attended</TableCell>
              <TableCell>Total Spend</TableCell>
              <TableCell>Last Visit</TableCell>
              <TableCell>Days Since Last Visit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((item, index) => {
                const lastVisitDate = new Date(item.lastVisit);
                const daysSinceLastVisit = Math.floor(
                  (new Date() - lastVisitDate) / (1000 * 60 * 60 * 24)
                );

                return (
                  <TableRow key={item._id}>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>{item._id}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.email}</TableCell>
                    <TableCell>{item.phone}</TableCell>
                    <TableCell>{item.campaignId?.name}</TableCell>
                    <TableCell>{item.totalSpending}</TableCell>
                    <TableCell>
                      {new Date(item.lastVisit).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{daysSinceLastVisit} days ago</TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>

        <TablePagination
          rowsPerPageOptions={[5]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </CardContent>

      {/* Dialog for adding new customer */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Add New Customer</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            fullWidth
            variant="outlined"
            margin="normal"
            name="name"
            value={newCustomer.name}
            onChange={handleInputChange}
          />
          <TextField
            label="Email"
            fullWidth
            variant="outlined"
            margin="normal"
            name="email"
            value={newCustomer.email}
            onChange={handleInputChange}
          />
          <TextField
            label="Phone"
            fullWidth
            variant="outlined"
            margin="normal"
            name="phone"
            value={newCustomer.phone}
            onChange={handleInputChange}
          />
          <TextField
            label="Total Spending"
            fullWidth
            variant="outlined"
            margin="normal"
            name="totalSpending"
            value={newCustomer.totalSpending}
            onChange={handleInputChange}
            type="number"
          />
          <TextField
            label="Last Visit"
            fullWidth
            variant="outlined"
            margin="normal"
            name="lastVisit"
            value={newCustomer.lastVisit}
            onChange={handleInputChange}
            type="datetime-local"
            InputLabelProps={{
              shrink: true,
            }}
          />

          {/* Campaign Selection Dropdown */}
          <FormControl fullWidth variant="outlined" margin="normal">
            <InputLabel>Campaign</InputLabel>
            <Select
              label="Campaign"
              name="campaignId"
              value={newCustomer.campaignId}
              onChange={handleInputChange}
            >
              {campagindata?.map((campaign) => (
                <MenuItem key={campaign._id} value={campaign._id}>
                  {campaign.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleCreateCustomer} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default CustomerData;
