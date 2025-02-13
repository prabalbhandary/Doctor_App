import { message, Tabs, Button } from "antd";
import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { hideLoading, showLoading } from "../redux/features/alertSlice";
import { setUser } from "../redux/features/userSlice";
import Layout from "./../components/Layout";
import { API } from "../API/API";

const NotificationPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const [refreshNotifications, setRefreshNotifications] = useState(false);

  // Handle read notification
  const handleMarkAllRead = async () => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        `${API}/user/get-all-notification`,
        {
          userId: user._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        const unreadNotifications = res.data.notifications
          ? res.data.notifications.filter(
              (notification) => !notification.isRead
            )
          : [];
        updateNotificationsInStore(unreadNotifications);
        setRefreshNotifications(!refreshNotifications);
        window.location.reload();
        message.success(res.data.message);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error("Something Went Wrong");
    }
  };

  // Handle delete notification
  const handleDeleteAllRead = async () => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        `${API}/user/delete-all-notification`,
        {
          userId: user._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        const updatedNotifications = res.data.notifications || [];
        const updatedUser = {
          ...user,
          notification: updatedNotifications.filter(
            (notification) => !notification.isRead
          ),
          seennotification: updatedNotifications.filter(
            (notification) => notification.isRead
          ),
        };
        dispatch(setUser(updatedUser));
        setRefreshNotifications(!refreshNotifications);
        message.success(res.data.message);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error("Something Went Wrong");
    }
  };

  const updateNotificationsInStore = (notifications) => {
    const updatedUser = {
      ...user,
      notification: [],
      seennotification: [],
    };
    notifications.forEach((notification) => {
      if (notification.isRead) {
        updatedUser.seennotification.push(notification);
      } else {
        updatedUser.notification.push(notification);
      }
    });
    dispatch(setUser(updatedUser));
  };

  return (
    <Layout>
      <h3 className="p-3 text-center">Notifications</h3>
      <Tabs>
        <Tabs.TabPane tab="New" key={0}>
          <div className="d-flex justify-content-end mb-3">
            <Button type="primary" danger onClick={handleMarkAllRead}>
              Mark All Read
            </Button>
          </div>
          {user && user.notification && user.notification.length > 0 ? (
            user.notification.map((notificationMgs) => (
              <div
                className="card mb-2"
                style={{ cursor: "pointer" }}
                key={notificationMgs._id}
                onClick={() => navigate(notificationMgs.onClickPath)}
              >
                <div className="card-body">{notificationMgs.message}</div>
              </div>
            ))
          ) : (
            <p className="text-center">You have no new notifications.</p>
          )}
        </Tabs.TabPane>
        <Tabs.TabPane tab="Read" key={1}>
          <div className="d-flex justify-content-end mb-3">
            <Button type="primary" danger onClick={handleDeleteAllRead}>
              Delete All Read
            </Button>
          </div>
          {user && user.seennotification && user.seennotification.length > 0 ? (
            user.seennotification.map((notificationMgs) => (
              <div
                className="card mb-2"
                style={{ cursor: "pointer" }}
                key={notificationMgs._id}
                onClick={() => navigate(notificationMgs.onClickPath)}
              >
                <div className="card-body">{notificationMgs.message}</div>
              </div>
            ))
          ) : (
            <p className="text-center">You have no read notifications</p>
          )}
        </Tabs.TabPane>
      </Tabs>
    </Layout>
  );
};

export default NotificationPage;
