# ImageDownloader

Coding project from a past recruitment.

A service for downloading images needs to be implemented.
Functional requirements:
The API of the service should have 3 functions:

Returning details about the downloaded image:
- Source URL from which the image was downloaded
- URL where our service stores a copy of the image
- Date the image was added
- Date the image download was completed
Adding images to the queue for the service to download:
- As a parameter, it will receive the URL of the image to be downloaded
- As a result, it will return a URL where you can check if the image has already been downloaded
Returning a list of objects from point 1.
- The list should allow efficient browsing of a large number of images
Non-functional requirements:
The service API should be in compliance with REST standards (including error handling). The API should be as fast and lightweight as possible (little code, without heavy frameworks).
Please prepare the task in a way that will be easy to test.
The actual image downloading must somehow be queued, the service should operate stably with a large number of requests, and be resilient to application restarts.


In the solution, I used Express, Redis, and Bull.js - a library for queuing. Redis seemed like a good choice for several reasons - speed, scalability, and simplicity. In addition, together with Bull.js, it provides an easy way to create and manage a queue.
In Redis, there will be 2 types of keys - one under which I store details about the image, and another under which the image itself is stored.

As a solution for returning the URL in the second functional point of the API, I return the same as in the first point. If the image hasn't been downloaded yet, the information will be incomplete.

As for the third point, I wasn't sure what was required. I return a list of details for all images; on the frontend, for example, you could fetch x items and fetch the next x when scrolling down, but I don't exactly know how this should look. Also, I didn't know whether, for example, to test if the URL leading to the image is correct, I assumed it is.
