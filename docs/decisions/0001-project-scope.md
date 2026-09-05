# ADR-0001: Define the Initial Project Scope

## Status

Accepted

## Context

Hospital Interoperability Hub is created to demonstrate the sharing workflow of medical records among different systems within the same hospital. It will demonstrate how records are shared and how to maintain accurate record exchange.

## Decision

Systems included are HIS/PAS, EHR/CPOE, LIS, PMS, and Inventory

## Data Ownership

HIS/PAS owns patient identifier and encounter ID and its status.
EHR owns physician notes and recommendations for the current encounter and discharge authorization.
CPOE owns the originating order records to different systems.
LIS owns the specimen-collection status and laboratory result/report.
PMS owns verification status and dispensing records.
Inventory owns movement records and authoritative stock.

## Reliability Rules

An acknowledgement is sent by the receiving system to the sender of a message. A positive ACK indicates acceptance; a negative ACK indicates rejection and should identify the error; no ACK means the delivery outcome is unknown. After correcting a rejected payload, or following a timeout, the sender retransmits the same business event using the same identifier. The receiver must detect previously processed identifiers, avoid repeating the business action, and return the previously recorded or current result.

## Out of Scope

Real patient data, production hospital connections, RIS/PACS, billing, insurance, HIE, and production deployment.

## Consequences

A narrow, synthetic scope is easier to implement, test, and explain, but it does not represent a complete production hospital environment.