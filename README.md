#  Spring Boot Ecommerce Cricket Backend
A production-ready backend REST API for a Cricket Ecommerce Platform built using Spring Boot.
##  Features
### Authentication & Security
- JWT-based authentication
- Role-based authorization (ADMIN, SELLER, USER)
- BCrypt password encryption
- Secure endpoints with Spring Security
### Product Management
- Seller-based product creation
- Product update & soft delete
- Pagination & filtering
- Out-of-stock handling
- Optimistic locking (prevents overselling)
### Cart Management
- Add to cart
- Update quantity
- Prevent duplicate cart items
- Clear cart

### Order Management
- Place order from cart
- Stock validation
- Order status update (Seller only)
- Cancel order with stock restoration

### Analytics
- Seller revenue calculation
- Admin-level analytics
- Top products query

### Architecture
- Layered architecture (Controller → Service → Repository)
- DTO-based request/response design
- Global exception handling
- Validation handling
- Clean API response structure
- 
## Tech Stack

- Java 17+
- Spring Boot
- Spring Security
- JWT
- Hibernate / JPA
- PostgreSQL
- Maven

## Advanced Concepts Implemented

- Optimistic Locking for stock concurrency control
- Role-based endpoint protection
- Custom exception handling
- Soft delete strategy
- Aggregation queries for analytics
- Clean RESTful API design

##  Project Structure

controller
service
repository
entity
dto
security
exception
config

##  Status

Backend completed and production-structured.  
Frontend can be integrated easily via REST APIs.

##  Author

Naveen Reddy  
Backend Developer | Java | Spring Boot
