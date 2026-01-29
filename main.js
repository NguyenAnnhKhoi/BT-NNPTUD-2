LoadData();
LoadComments();

function LoadData() {
    //HTTP Request GET, GET1, PUT, POST, DELETE
    fetch('http://localhost:3000/posts').then(
        function (data) {
            return data.json()
        }
    ).then(
        function (posts) {
            let body = document.getElementById('post-body');
            body.innerHTML = "";
            for (const post of posts) {
                body.innerHTML += convertDataToHTML(post);
            }
        }
    ).catch(
        function (err) {
            console.log(err);
        }
    )
}

function convertDataToHTML(post) {
    const isDeleted = post.isDeleted === true;
    const idHtml = isDeleted ? `<s>${post.id}</s>` : post.id;
    const titleHtml = isDeleted ? `<s>${post.title}</s>` : post.title;
    const viewsHtml = isDeleted ? `<s>${post.views}</s>` : post.views;
    return `<tr>
        <td>${idHtml}</td>
        <td>${titleHtml}</td>
        <td>${viewsHtml}</td>
        <td><input type='submit' value='delete' onclick='DeletePost("${post.id}")'/></td>
    </tr>`
}

function saveData() {
    let id = document.getElementById("id_txt").value.trim();
    let title = document.getElementById("title_txt").value;
    let view = document.getElementById('views_txt').value;

    // Nếu bỏ trống ID => tạo mới với ID tự tăng
    if (id === "") {
        fetch('http://localhost:3000/posts')
            .then(function (res) { return res.json(); })
            .then(function (posts) {
                let maxId = 0;
                for (const p of posts) {
                    const pid = parseInt(p.id, 10);
                    if (!isNaN(pid) && pid > maxId) {
                        maxId = pid;
                    }
                }
                const newId = (maxId + 1).toString();
                return fetch('http://localhost:3000/posts', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id: newId,
                        title: title,
                        views: view,
                        isDeleted: false
                    })
                });
            })
            .then(function (res) {
                if (res && res.ok) {
                    console.log("them moi thanh cong");
                    LoadData();
                }
            })
            .catch(function (err) {
                console.log(err);
            });
        return false;
    }

    // Có ID => cập nhật hoặc tạo với ID đó nếu chưa tồn tại
    fetch('http://localhost:3000/posts/' + id).then(
        function (res) {
            if (res.ok) {
                return fetch('http://localhost:3000/posts/' + id, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id: id,
                        title: title,
                        views: view,
                        isDeleted: false
                    })
                });
            } else {
                return fetch('http://localhost:3000/posts', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id: id,
                        title: title,
                        views: view,
                        isDeleted: false
                    })
                });
            }
        }
    ).then(function (res) {
        if (res && res.ok) {
            console.log("luu thanh cong");
            LoadData();
        }
    }).catch(function (err) {
        console.log(err);
    });

    return false;
}

function DeletePost(id) {
    // Xoá mềm: set isDeleted = true
    fetch('http://localhost:3000/posts/' + id, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            isDeleted: true
        })
    }).then(function (res) {
        if (res.ok) {
            console.log("xoa mem thanh cong");
            LoadData();
        }
    }).catch(function (err) {
        console.log(err);
    });
}

// ================= COMMENTS =================

function LoadComments() {
    fetch('http://localhost:3000/comments')
        .then(function (data) { return data.json(); })
        .then(function (comments) {
            let body = document.getElementById('comment-body');
            if (!body) return;
            body.innerHTML = "";
            for (const c of comments) {
                body.innerHTML += convertCommentToHTML(c);
            }
        })
        .catch(function (err) {
            console.log(err);
        });
}

function convertCommentToHTML(comment) {
    const isDeleted = comment.isDeleted === true;
    const idHtml = isDeleted ? `<s>${comment.id}</s>` : comment.id;
    const textHtml = isDeleted ? `<s>${comment.text}</s>` : comment.text;
    const postIdHtml = isDeleted ? `<s>${comment.postId}</s>` : comment.postId;
    return `<tr>
        <td>${idHtml}</td>
        <td>${textHtml}</td>
        <td>${postIdHtml}</td>
        <td><input type='submit' value='delete' onclick='DeleteComment("${comment.id}")'/></td>
    </tr>`
}

function saveComment() {
    let id = document.getElementById("cmt_id_txt").value.trim();
    let text = document.getElementById("cmt_text_txt").value;
    let postId = document.getElementById("cmt_postId_txt").value;

    if (id === "") {
        // Tạo mới comment với ID tự tăng (chuỗi)
        fetch('http://localhost:3000/comments')
            .then(function (res) { return res.json(); })
            .then(function (comments) {
                let maxId = 0;
                for (const c of comments) {
                    const cid = parseInt(c.id, 10);
                    if (!isNaN(cid) && cid > maxId) {
                        maxId = cid;
                    }
                }
                const newId = (maxId + 1).toString();
                return fetch('http://localhost:3000/comments', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id: newId,
                        text: text,
                        postId: postId,
                        isDeleted: false
                    })
                });
            })
            .then(function (res) {
                if (res && res.ok) {
                    console.log("them moi comment thanh cong");
                    LoadComments();
                }
            })
            .catch(function (err) { console.log(err); });
        return false;
    }

    // Có ID => cập nhật hoặc tạo với ID đó
    fetch('http://localhost:3000/comments/' + id)
        .then(function (res) {
            if (res.ok) {
                return fetch('http://localhost:3000/comments/' + id, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id: id,
                        text: text,
                        postId: postId,
                        isDeleted: false
                    })
                });
            } else {
                return fetch('http://localhost:3000/comments', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id: id,
                        text: text,
                        postId: postId,
                        isDeleted: false
                    })
                });
            }
        })
        .then(function (res) {
            if (res && res.ok) {
                console.log("luu comment thanh cong");
                LoadComments();
            }
        })
        .catch(function (err) { console.log(err); });

    return false;
}

function DeleteComment(id) {
    fetch('http://localhost:3000/comments/' + id, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            isDeleted: true
        })
    }).then(function (res) {
        if (res.ok) {
            console.log("xoa mem comment thanh cong");
            LoadComments();
        }
    }).catch(function (err) {
        console.log(err);
    });
}
