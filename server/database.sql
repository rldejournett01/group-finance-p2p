CREATE DATABASE ledger;

CREATE TABLE IF NOT EXISTS accounts (
    id SERIAL PRIMARY KEY,
    user_id UUID UNIQUE NULL,
    group_id UUID UNIQUE NULL,
    type TEXT NOT NULL,
    current_balance NUMERIC(19,4) NOT NULL,
    created_at TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS todo (
    todo_id SERIAL PRIMARY KEY,
    description VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    external_ref_id UUID UNIQUE NULL,
    status TEXT NOT NULL,
    description TEXT NOT NULL,
    value_date DATE NOT NULL,
    commited_at TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS entries(
        id SERIAL PRIMARY KEY,
        account_id INT NOT NULL,
        transaction_id INT NOT NULL,
        type TEXT NOT NULL,
        amount NUMERIC(19,4) NOT NULL,
        is_settlement BOOLEAN NOT NULL,
        created_at TIMESTAMP NOT NULL
);