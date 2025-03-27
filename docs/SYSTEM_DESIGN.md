# System Design Document

## Overview

Etomovich Journal App is a full-stack journaling application built with Next.js, Prisma, NextAuth, and Tailwind CSS. It offers advanced features including user authentication, journal management, categorization & tagging, analytics, and AI-powered analysis.

## Architecture Diagram

*(Include your PlantUML diagram or a reference to an image here.)*

## Components

- **Frontend:** Built using Next.js (v15.2.4) with the new App Router and TypeScript. UI components are inspired by ShadCN and styled with Tailwind CSS.
- **Backend:** Utilizes Next.js API routes with Prisma ORM connecting to a PostgreSQL database.
- **Authentication:** Implemented using NextAuth with both Google and credentials providers. Sessions are managed using JWT.
- **Data Model:** Uses a relational PostgreSQL database with models for User, JournalEntry, Category, Tag, EntryCategory, EntryTag, and Reminder.
- **AI Features:** Integrated via the OpenAI API to provide sentiment analysis, theme extraction, and writing suggestions.
- **Analytics:** Journal insights are visualized using Chart.js and react-chartjs-2.
- **Deployment & Scalability:** Designed to leverage Next.js server components, with future considerations for caching, logging, and potential serverless deployment.

## Data Model

The Prisma schema defines the following models:
- **User:** Contains basic user details, hashed password, and fields for password reset.
- **JournalEntry:** Stores journal entries, with support for soft deletion.
- **Category & Tag:** Allow categorization and tagging of journal entries, linked through intermediate join models (EntryCategory and EntryTag).
- **Reminder:** Enables users to set reminders for journal activities.

## Security Measures

- **Authentication & Sessions:** NextAuth is configured with secure JWT sessions.
- **Data Sanitization:** All inputs are validated and sanitized on the server.
- **Password Management:** Passwords are hashed using bcrypt.

## Scalability

- **Database Performance:** PostgreSQL with Prisma ensures efficient querying. Indexing and query optimization strategies are in place.
- **Server Architecture:** Next.js supports both server-side rendering and serverless deployment, enabling horizontal scaling.
- **Future Enhancements:** Implementing caching strategies and using edge functions for low-latency data delivery.

## Future Enhancements

- Enhanced caching and performance optimizations.
- Extended AI capabilities and writing suggestions.
- Improved logging and monitoring for production scaling.
