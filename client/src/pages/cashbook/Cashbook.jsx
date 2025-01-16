import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LayoutApp from '../../components/Layout';
import { useNavigate } from 'react-router-dom';
import './cashbook.css';

const Cashbook = () => {
    const [creditData, setCreditData] = useState([]);
    const [currentImages, setCurrentImages] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    // Group data by CNIC or Contact
    const groupByCNICOrContact = (data) => {
        const grouped = data.reduce((acc, bill) => {
            const key = bill.customerCNIC || bill.customerPhone; // Use CNIC or Contact
            if (!acc[key]) {
                acc[key] = {
                    customerName: bill.customerName,
                    customerPhone: bill.customerPhone,
                    customerCNIC: bill.customerCNIC,
                    totalAmount: 0,
                    remainingAmount: 0,
                    bills: [],
                };
            }
            acc[key].totalAmount += bill.totalAmount;
            acc[key].remainingAmount += bill.remainingAmount;
            acc[key].bills.push(bill);
            return acc;
        }, {});
        return Object.values(grouped); // Convert grouped object to array
    };

    useEffect(() => {
        const fetchCreditData = async () => {
            try {
                const { data } = await axios.get("/api/bills/getbills");
                const filteredData = data.filter(
                    (bill) => bill.paymentMethod === "credit" && bill.remainingAmount > 0
                );
                const groupedData = groupByCNICOrContact(filteredData);
                setCreditData(groupedData);
            } catch (error) {
                console.error("Error fetching credit data:", error);
            }
        };

        fetchCreditData();
    }, []);

    const openModal = (images, index) => {
        setCurrentImages(images);
        setCurrentIndex(index);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const nextImage = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === currentImages.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevImage = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? currentImages.length - 1 : prevIndex - 1
        );
    };

    return (
        <LayoutApp>
            <h1 className="cashbook-title">Cashbook</h1>
            <div className="cashbook-panels">
                <div className="panel get-money">
                    <h2>To Whom I Have to Get Money</h2>
                    {creditData.map((entry, index) => (
                        <div key={index} className="entry-card">
                            <div className="card-header">
                                <p><strong>Name:</strong> {entry.customerName}</p>
                                <p><strong>Contact:</strong> {entry.customerPhone}</p>
                                <p>
                                    <strong>Customer CNIC:</strong>{" "}
                                    <span className={entry.customerCNIC ? "cnic-available" : "cnic-unavailable"}>
                                        {entry.customerCNIC || "Not Available"}
                                    </span>
                                </p>
                            </div>
                            {entry.bills.map((bill, billIndex) => (
                                <div key={billIndex} className="bill-details">
                                    <p><strong>Bill Date:</strong> {new Date(bill.createdAt).toLocaleString()}</p>
                                    <p><strong>Bill Total:</strong> Rs. {bill.totalAmount}</p>
                                    <p><strong>Remaining:</strong> Rs. {bill.remainingAmount}</p>
                                    <div className="product-imagesu">
    {bill.cartItems.map((product, index) => 
        product.image && ( 
            <img
                key={index}
                src={product.image}
                alt={product.name}
                className="product-imageu"
                onClick={() =>
                    openModal(
                        bill.cartItems.filter((item) => item.image).map((item) => item.image),
                        index
                    )
                }
            />
        )
    )}
</div>

                                    <button
                                        className="clear-due-btn"
                                        onClick={() => {
                                            navigate(
                                                `/cart?edit=true&id=${bill._id}&customerName=${entry.customerName}&customerPhone=${entry.customerPhone}&customerAddress=${bill.customerAddress}&customerCNIC=${entry.customerCNIC}&tax=${bill.tax || 0}&discount=${bill.discount || 0}&paymentMethod=${bill.paymentMethod}&paidAmount=${bill.paidAmount || 0}&remainingAmount=${bill.remainingAmount || 0}`
                                            );
                                        }}
                                    >
                                        Clear Due
                                    </button>
                                    <hr className="bill-separator" />
                                </div>
                            ))}
                            <div className="card-footer">
                                <p><strong>Total Amount:</strong> Rs. {entry.totalAmount}</p>
                                <p><strong>Remaining Amount:</strong> Rs. {entry.remainingAmount}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {isModalOpen && (
                <div className="image-modalu">
                    <div className="overlayu" onClick={closeModal}></div>
                    <div className="modal-contentu">
                        <button className="close-btnu" onClick={closeModal}>×</button>
                        <button className="prev-btnu" onClick={prevImage}>←</button>
                        <img src={currentImages[currentIndex]} alt="Product" className="modal-image" />
                        <button className="next-btnu" onClick={nextImage}>→</button>
                    </div>
                </div>
            )}
        </LayoutApp>
    );
};

export default Cashbook;
