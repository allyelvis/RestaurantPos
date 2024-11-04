-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tables table
CREATE TABLE tables (
    id SERIAL PRIMARY KEY,
    table_number INT UNIQUE NOT NULL,
    capacity INT NOT NULL,
    status VARCHAR(20) DEFAULT 'available'
);

-- Menu_Items table
CREATE TABLE menu_items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(50) NOT NULL,
    is_available BOOLEAN DEFAULT true
);

-- Orders table
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    table_id INT REFERENCES tables(id),
    user_id INT REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order_Items table
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(id),
    menu_item_id INT REFERENCES menu_items(id),
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);

-- Inventory table
CREATE TABLE inventory (
    id SERIAL PRIMARY KEY,
    item_name VARCHAR(100) NOT NULL,
    quantity INT NOT NULL,
    unit VARCHAR(20) NOT NULL,
    reorder_level INT NOT NULL
);

-- Stock_Movements table
CREATE TABLE stock_movements (
    id SERIAL PRIMARY KEY,
    inventory_id INT REFERENCES inventory(id),
    quantity INT NOT NULL,
    movement_type VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Departments table
CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

-- Stock_Requisitions table
CREATE TABLE stock_requisitions (
    id SERIAL PRIMARY KEY,
    department_id INT REFERENCES departments(id),
    user_id INT REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Stock_Requisition_Items table
CREATE TABLE stock_requisition_items (
    id SERIAL PRIMARY KEY,
    requisition_id INT REFERENCES stock_requisitions(id),
    inventory_id INT REFERENCES inventory(id),
    quantity INT NOT NULL
);

-- Indexes
CREATE INDEX idx_orders_table_id ON orders(table_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_menu_item_id ON order_items(menu_item_id);
CREATE INDEX idx_stock_movements_inventory_id ON stock_movements(inventory_id);
CREATE INDEX idx_stock_requisitions_department_id ON stock_requisitions(department_id);
CREATE INDEX idx_stock_requisitions_user_id ON stock_requisitions(user_id);

-- Trigger for updating inventory after order
CREATE OR REPLACE FUNCTION update_inventory_after_order() RETURNS TRIGGER AS $$
BEGIN
    UPDATE inventory
    SET quantity = quantity - NEW.quantity
    WHERE id = (SELECT inventory_id FROM menu_items WHERE id = NEW.menu_item_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_inventory_after_order
AFTER INSERT ON order_items
FOR EACH ROW
EXECUTE FUNCTION update_inventory_after_order();
