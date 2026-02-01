# Review-system-
For debugging and testing  my manga-api
I actually added file upload for image and video (mp4) under 50mb and 150 mb.
I also added multer for security and file upload for security 
I also added translate features using google api here (auto translate to ----> english)
Emoji picker added u can add what ever emogi u like ~(:-))
here how review look in my mdb ex 

Reviewers_detail
Array (7)

0
Object
parentId
null
ReviewerName
"Anonymous"
ReviewerLike
0
ReviewerDisLike
0
ReviewProfileImage
"1.png"

ReviewMedia
Array (empty)

ReviewerLikeby
Array (empty)

ReviewerDisLikeby
Array (empty)
Rating
4
Review
"bjbk"
date
2026-01-25T17:22:30.286+00:00
Overallexperience
"Outstanding"
_id
697651564a600513c25080c3
.thread-container
   *     |- .overalluser (depth 0)          <- parent review
   *     |- .replycap                       <- holds depth-1 replies
   *           |- .reply-wrapper
   *                 |- .overalluser.reply (depth 1)
   *                 |- .replycap           <- holds depth-2 replies
   *                       |- .reply-wrapper
   *                             |- .overalluser.reply (depth 2)
   *                             |- .replycap ...