import React from "react";
import { act, render, screen } from "@testing-library/react";
import { getPostById } from '../../services/postService';
import { BrowserRouter } from "react-router-dom";
import { Post } from "./Post";

jest.mock("../../services/postService", () => ({
    getPostById: jest.fn()
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom') as any,
    useParams: jest.fn(() => ({
        id: 5
    })),
}));

const mockPost = {
    id: 5,
    title: "titlechupipandi",
    body: "bodychupipandi"
}


afterEach(jest.clearAllMocks);

describe('PostComponent', () => {

    describe('When render', () => {

        test("Should render a title Post", async () => {
            await act(async () => render(<BrowserRouter><Post /></BrowserRouter>) as any)
            expect(screen.getByText("Post 5")).toBeInTheDocument();
        })

        test("it should render post title and post body", async () => {
            (getPostById as jest.Mock).mockImplementation(() => {
                return Promise.resolve(mockPost);
            });
            await act(async () => render(<BrowserRouter><Post /></BrowserRouter>) as any)
            expect(screen.getByText("titlechupipandi")).toBeInTheDocument();
            expect(screen.getByText("bodychupipandi")).toBeInTheDocument();
        })

        test("it should not render post title and post body if there is no post found", async () => {
            (getPostById as jest.Mock).mockRejectedValueOnce(new Error("network error"));
            await act(async () => render(<BrowserRouter><Post /></BrowserRouter>) as any);
            expect(screen.queryByText('Post')).not.toBeInTheDocument();
        })
    })
})