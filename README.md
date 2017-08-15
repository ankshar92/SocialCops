#Social Cops - IPL Dashboard



##Github URL:-
https://github.com/ankshar92/SocialCops



##Working Website URL:-
https://ankshar92.github.io

The site automatically redirects to https://ankshar92.github.io/dashboard/2016/22-05-2016 . However, refreshing the page would not work as the server tries to serve that URL and not the index.html. Hence, the server needs to be configured.

The URL is of the form https://ankshar92.github.io/dashboard/:season/:todaysDate and the parameters could be given but since Github does not allow serving index.html, this feature could only be tested by running the application from the code base.


##Description:-
A practical approach to test a developer's skills using his / her coding abilities.



##Frameworks used:-
1. Angular 4 - to create a feature rich Single Page Application

2. Bootstrap - for a responsive web application capable of running in mobile / tablet / desktops

3. D3 / NVD3 / NG2-NVD3 - to create beautiful graph and pie chart (for visualization)

4. FontAwesome - to use beautiful icons

5. PrimeNG - to use the out-of-the-box table layout in the web application



##Bonus Points:-
1. Vue.js - the application is not created in vue.js but in Angular 4.

2. Loading time - the loading time is optimized by using the web workers to handle data processing on large sets of data. The promise API is then used to carry out the tasks after asynchronous tasks. The data from Matches.csv is saved in IndexedDB of HTML and retrieved using the web worker. However, the data in deliveries.csv was more than 1,36,000 rows and hence it is given to a web worker to convert the CSV into JSON and a variable is initialized with this JSON.

3. Mobile Responsive - the application is mobile responsive by using the 12 grid layout of Bootstrap and custom media queries.

4. PWA - the application is not yet a PWA.

5. Offline Usable - the application can be accessed in an offline mode. I have used Application Manifest to cache the application files.

Total Bonus Points worked on - 3



##Version Control System:-
Git is used as a VCS and Github is used to push the code. The URL for the code is https://github.com/ankshar92/SocialCops



##Hosting
The web app is hosted using Github pages. The URL is https://ankshar92.github.io
