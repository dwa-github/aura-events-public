// app/api/upload-image/route.js
import { NextResponse } from "next/server"
import { put } from "@vercel/blob"

export async function POST(request) {
  const { searchParams } = new URL(request.url)
  const filename = searchParams.get("filename")

  if (!filename || !request.body) {
    return NextResponse.json(
      { message: "Filename and image body are required." },
      { status: 400 }
    )
  }

  try {
    const blob = await put(filename, request.body, {
      access: "public",
      allowOverwrite: true,
    })
    return NextResponse.json(blob, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { message: "Error uploading image.", error: error.message },
      { status: 500 }
    )
  }
}
