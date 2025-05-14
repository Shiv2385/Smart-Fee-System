const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejs = require('ejs');

const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/login-signup-app');
const db = mongoose.connection;




// Define User Schema
const userSchema = new mongoose.Schema({
    rollNo: String,
    name: String,
    password: String,
    gender: String,
    branch: String,
    dob: String,
    ayear: Number,
    semester: Number,
    religion: String,
    category: String,
    gmail: String
});
const User = mongoose.model('User', userSchema);


// Middleware to parse JSON bodies
app.use(bodyParser.json());
// Set EJS as the view engine
app.set('view engine', 'ejs');

//middleware
app.use(bodyParser.urlencoded({ extended: true }));


//get request to get signup page
app.get('/signup', (req, res) => {
    res.sendFile(__dirname + '/signup.html');
});

// post-request in signup page to upload student details
app.post('/signup', (req, res) => {
    const { rollNo } = req.body;
    // Check if user with the provided rollNo already exists
    User.findOne({ rollNo })
        .then(existingUser => {
            if (existingUser) {
                res.send('<script>alert("User already exists with this rollNo"); window.history.back();</script>');
            } else {
                const newUser = new User({
                    rollNo: req.body.rollNo,
                    name: req.body.name,
                    password: req.body.password,
                    gender: req.body.gender,
                    branch: req.body.branch,
                    dob: req.body.dob,
                    ayear: req.body.ayear,
                    semester: req.body.semester,
                    religion: req.body.religion,
                    category: req.body.category,
                    gmail: req.body.gmail
                });
                newUser.save()
                    .then(() => {
                        res.redirect('/');
                    })
                    .catch(error => {
                        console.error(error);
                    });
            }
        })
        .catch(error => {
            console.error(error);
            res.status(500).send('Internal Server Error');
        });
});



//schema for admin login
const adminSchema = new mongoose.Schema({
    rollNo: String,
    password: String
});
const Admin = mongoose.model('Admin', adminSchema);

//admin login page login verification part to go admin home page
app.post('/adminlogin', (req, res) => {
    const { rollNo, password } = req.body;

    // Find admin by rollNo
    Admin.findOne({ rollNo })
        .then(admin => {
            if (!admin || admin.password !== password) {
                res.send('<script>alert("Incorrect Admin-id or password"); window.history.back();</script>');
            } else {
                // Find students with read=false and perform insertion
                Fee.find({ read: false })
                .then(students => {
                    // Redirect to admin home page and pass the found students
                    res.render('adminhome', { feeDetails: students });
                })
                    .catch(error => {
                        console.error('Error finding students:', error);
                        res.status(500).send('Internal Server Error');
                    });
            }
        })
        .catch(error => {
            console.error('Error finding admin:', error);
            res.status(500).send('Internal Server Error');
        });
});
//get request to get admin login page
app.get('/adminlogin', (req, res) => {
    res.sendFile(__dirname + '/adminlogin.html');
});



//schema for tution fee 
const tutionFeesSchema = new mongoose.Schema({
    spfee: Number,
    adfee: Number,
    unifee: Number,
    ayear: Number,
    ctf: Number,
    mtf: Number,
    etf: Number,
    cstf: Number,
    c85: Number,
    c90: Number,
    c95: Number,
    m85: Number,
    m90: Number,
    m95: Number,
    e75: Number,
    e80: Number,
    e90: Number,
    cs90: Number,
    cs95: Number
});
const TutionFees = mongoose.model('TutionFees', tutionFeesSchema);



// Serve login.html as the initial page by default
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/login.html');
});


//get request to get adminhome page
app.get('/adminhome.html', (req, res) => {
    res.sendFile(__dirname + '/adminhome.html');
});

// get request for feesetup to go to feesetup page
app.get('/feesetup', (req, res) => {
    res.sendFile(__dirname + '/feesetup.html');
});

//post-request to upload fee by admin in feesetup page
app.post('/feesetup', (req, res) => {
    const { ayear } = req.body;
    
    if (!ayear) {
        res.status(400).send('Academic year is required');
        return;
    }
    // Check if user with the provided rollNo already exists
    TutionFees.findOne({ ayear })
    .then(existingFee => {
        if (existingFee) {
            res.send('<script>alert("cannot enter dublicate data"); window.history.back();</script>');
        } else {
            const newFee = new TutionFees({
                spfee:req.body.spfee,
                adfee:req.body.adfee,
                unifee:req.body.unifee,
                ayear:req.body.ayear,
                ctf:req.body.ctf,
                mtf:req.body.mtf,
                etf:req.body.etf,
                cstf:req.body.cstf,
                c85:req.body.c85,
                c90:req.body.c90,
                c95:req.body.c95,
                m85:req.body.m85,
                m90:req.body.m90,
                m95:req.body.m95,
                e75:req.body.e75,
                e80:req.body.e80,
                e90:req.body.e90,
                cs90:req.body.cs90,
                cs95:req.body.cs95
            });
            newFee.save()
                .then(() => {
                    res.send('<script>alert("Fees Uploaded Sucuessfully..."); window.history.back();</script>');
                })
                .catch(error => {
                    console.error(error);
                });
        }
    })
    .catch(error => {
        console.error(error);
        res.status(500).send('Internal Server Error');
    });
});




//get request for login page
app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/login.html');
});
// Login Route and to go in stuent details page
app.post('/login', (req, res) => {
    const { rollNo, password } = req.body;

    // Find user by rollNo
    User.findOne({ rollNo })
        .then(user => {
            if (!user || user.password !== password) {
                res.send('<script>alert("Incorrect rollNo or password"); window.history.back();</script>');
            } else {
                // Find fee details by rollNo
                Fee.find({ rollNo })
                    .then(feeDetails => {
                        res.render('studetail', {
                            user,
                            feeDetails,
                            rollNo: user.rollNo, // Pass the rollNo variable here
                            name: user.name,
                            gmail: user.gmail,
                            ayear: user.ayear,
                            dob: user.dob,
                            gender: user.gender,
                            category: user.category, // Pass the category variable here
                            religion: user.religion,
                            branch: user.branch,
                            semester: user.semester,
                            // Add other variables here
                        });
                    })
                    .catch(err => {
                        console.error(err);
                        res.status(500).send('Internal Server Error1');
                    });



            }
        })
        .catch(error => {
            console.error(error);
            res.status(500).send('Internal Server Error2');
        });
});


//enter rollno in admin home page show detains in admin-student details page 
app.post('/astd', (req, res) => {
    const { rollNo } = req.body;

    // Find user by rollNo
    User.findOne({ rollNo })
        .then(user => {
            if (!user) {
                res.send('<script>alert("No user found with this rollNo"); window.history.back();</script>');
            } else { // Find fee details by rollNo
                Fee.find({ rollNo })
                    .then(feeDetails => {
                        res.render('astudetail', {
                            user,
                            feeDetails,
                            rollNo: user.rollNo, // Pass the rollNo variable here
                            name: user.name,
                            gmail: user.gmail,
                            ayear: user.ayear,
                            dob: user.dob,
                            gender: user.gender,
                            category: user.category, // Pass the category variable here
                            religion: user.religion,
                            branch: user.branch,
                            semester: user.semester,
                            // Add other variables here
                        });
                    })
                    .catch(err => {
                        console.error(err);
                        res.status(500).send('Internal Server Error1');
                    });
            }
        })
        .catch(error => {
            console.error(error);
            res.status(500).send('Internal Server Error');
        });
});






//to set background clg pic in public
app.get('/clg.jpg', (req, res) => {
    res.sendFile(__dirname + '/clg.jpg');
});


// save Fee Schema
const feeSchema = new mongoose.Schema({
    rollNo: String,
    totalfee: Number,
    balance: { type: Number, default: 0 },
    sgpa: Number,
    semester: Number,
    read: { type: Boolean, default: false },
    status: { type: Boolean, default: false },
    pay: { type:String, default:"pay" },
    textfield: String,
    branch: String,
    name: String
});
const Fee = mongoose.model('Fee', feeSchema);

//go to save-fee from student detail page
app.post('/studetail', (req, res) => {
    const { rollNo } = req.body;
    // Render the savefee.ejs template with the rollNo parameter
    res.render('savefee', { rollNo: rollNo });
});


// save rollno again back in savefee page
app.get('/savefee', (req, res) => {
    const { rollNo } = req.query; // Retrieve rollNo from query parameters
    if (!rollNo) {
        return res.status(400).send('<script>alert("Click OK to continue..."); window.history.back();</script>');
    }
    res.render('studetail', { rollNo });
});

// post request in save-fee page to calc fee and upload to fees collection database
app.post('/savefee', (req, res) => {
    const { rollNo } = req.body;

    // Find the user with the provided rollNo to fetch the branch
    User.findOne({ rollNo })
        .then(user => {
            if (!user) {
                res.status(404).send('<script>alert("User not found."); window.history.back();</script>');
            } else {
                const { rollNo, semester, textfield, sgpa } = req.body;

                // Check if the input link is valid
                if (textfield.startsWith("https://app.ktu.edu.in/eu/pub") || textfield === "") {
                    // Fetch tuition fees for the corresponding academic year
                    const academicYear = user.ayear;
                    TutionFees.findOne({ ayear: academicYear })
                        .then(tuitionFees => {
                            if (!tuitionFees) {
                                return res.status(500).send('<script>alert("Tuition fees not found for the academic year."); window.history.back();</script>');
                            }

                            // If academic years don't match, handle accordingly
                            if (academicYear !== tuitionFees.ayear) {
                                return res.status(500).send('<script>alert("Academic years do not match."); window.history.back();</script>');
                            }

                            // Calculate regular fee based on branch, SGPA, and semester
                            let regularFee;

                            if (semester === "1") {
                                if (user.branch === "computer") {
                                    if (sgpa >= 95) {
                                        regularFee = tuitionFees.cs95;
                                    } else if (sgpa >= 90) {
                                        regularFee = tuitionFees.cs90;
                                    }
                                } else if (user.branch === "civil") {
                                    if (sgpa >= 95) {
                                        regularFee = tuitionFees.c95;
                                    } else if (sgpa >= 90) {
                                        regularFee = tuitionFees.c90;
                                    } else if (sgpa >= 85) {
                                        regularFee = tuitionFees.c85;
                                    }
                                } else if (user.branch === "mechanics") {
                                    if (sgpa >= 95) {
                                        regularFee = tuitionFees.m95;
                                    } else if (sgpa >= 90) {
                                        regularFee = tuitionFees.m90;
                                    } else if (sgpa >= 85) {
                                        regularFee = tuitionFees.m85;
                                    }
                                } else if (user.branch === "electrical") {
                                    if (sgpa >= 90) {
                                        regularFee = tuitionFees.e90;
                                    } else if (sgpa >= 80) {
                                        regularFee = tuitionFees.e80;
                                    } else if (sgpa >= 75) {
                                        regularFee = tuitionFees.e75;
                                    }
                                }
                            } else {
                                if (user.branch === "computer") {
                                    if (sgpa >= 9.5) {
                                        regularFee = tuitionFees.cs95;
                                    } else if (sgpa >= 9.0) {
                                        regularFee = tuitionFees.cs90;
                                    }
                                } else if (user.branch === "civil") {
                                    if (sgpa >= 9.5) {
                                        regularFee = tuitionFees.c95;
                                    } else if (sgpa >= 9.0) {
                                        regularFee = tuitionFees.c90;
                                    } else if (sgpa >= 8.5) {
                                        regularFee = tuitionFees.c85;
                                    }
                                } else if (user.branch === "mechanics") {
                                    if (sgpa >= 9.5) {
                                        regularFee = tuitionFees.m95;
                                    } else if (sgpa >= 9.0) {
                                        regularFee = tuitionFees.m90;
                                    } else if (sgpa >= 8.5) {
                                        regularFee = tuitionFees.m85;
                                    }
                                } else if (user.branch === "electrical") {
                                    if (sgpa >= 9.0) {
                                        regularFee = tuitionFees.e90;
                                    } else if (sgpa >= 8.0) {
                                        regularFee = tuitionFees.e80;
                                    } else if (sgpa >= 7.5) {
                                        regularFee = tuitionFees.e75;
                                    }
                                }
                            }


                            // If regularFee is not calculated, set default based on branch
                            if (!regularFee) {
                                switch (user.branch) {
                                    case "computer":
                                        regularFee = tuitionFees.cstf;
                                        break;
                                    case "electric":
                                        regularFee = tuitionFees.etf;
                                        break;
                                    case "civil":
                                        regularFee = tuitionFees.ctf;
                                        break;
                                    case "mechanical":
                                        regularFee = tuitionFees.mtf;
                                        break;
                                }
                            }


                            // Add additional fees
                            const specialFee = tuitionFees.spfee;
                            const admissionFee = tuitionFees.adfee;
                            const universityFee = tuitionFees.unifee;

                            // Calculate total fee
                            let totalFee;
                            if (semester === 1) {
                                totalFee = regularFee + specialFee + admissionFee + universityFee;
                            } else {
                                totalFee = regularFee + specialFee + admissionFee;
                            }

                            // Check if there is an existing entry with the same rollNo and semester
                            Fee.findOne({ rollNo, semester })
                                .then(existingFee => {
                                    if (existingFee) {
                                        // Check nested conditions
                                        if (existingFee.read && !existingFee.pay && existingFee.semester === req.body.semester && existingFee.rollNo === req.body.rollNo) {
                                            Fee.updateOne({ _id: existingFee._id }, {
                                                rollNo: req.body.rollNo,
                                                totalfee: totalFee,
                                                sgpa: req.body.sgpa,
                                                semester: req.body.semester,
                                                textfield: req.body.textfield,
                                                branch: user.branch,
                                                name: user.name,
                                                balance: 0,
                                                read: false,
                                                status: false,
                                                pay:"pay"
                                            })
                                                .then(() => {
                                                    res.send('<script>alert("Uploaded again.");</script>');
                                                })
                                                .catch(error => {
                                                    console.error(error);
                                                    res.status(500).send('<script>alert("Internal Server Error0"); window.history.back();</script>');
                                                });
                                        } else if (existingFee.read && existingFee.pay) {
                                            res.send('<script>alert("Cannot make changes."); window.history.back();</script>');
                                        } else {
                                            res.send('<script>alert("Verifying..."); window.history.back();</script>');
                                        }
                                    } else {
                                        const newFee = new Fee({
                                            rollNo: req.body.rollNo,
                                            totalfee: totalFee,
                                            sgpa: req.body.sgpa,
                                            semester: req.body.semester,
                                            textfield: req.body.textfield,
                                            branch: user.branch,
                                            name: user.name,
                                            balance: 0,
                                            read: false,
                                            status: false,
                                            pay:"pay"
                                        });
                                        newFee.save()
                                            .then(() => {
                                                res.send('<script>alert("Uploaded successfully."); window.location.href="/savefee";</script>');
                                            })
                                            .catch(error => {
                                                console.error(error);
                                                res.status(500).send('<script>alert("Internal Server Error1"); window.history.back();</script>');
                                            });
                                    }
                                })
                                .catch(error => {
                                    console.error(error);
                                    res.status(500).send('<script>alert("Internal Server Error2"); window.history.back();</script>');
                                });
                        })
                        .catch(error => {
                            console.error(error);
                            res.status(500).send('<script>alert("Internal Server Error3"); window.history.back();</script>');
                        });
                } else {
                    res.send('<script>alert("Invalid link."); window.history.back();</script>');
                }
            }
        })
        .catch(error => {
            console.error(error);
            res.status(500).send('<script>alert("Internal Server Error4"); window.history.back();</script>');
        });
});



app.post('/updateStatus', (req, res) => {
    const { semester, rollNo, status } = req.body;
    
    console.log('Received semester:', semester);
    console.log('Received rollNo:', rollNo);
    console.log('statusis:', status);
    Fee.findOneAndUpdate({ semester, rollNo }, { status: status , read : true }, { new: true })
        .then(updatedStatus => {
            res.status(200).json({ message: 'Pay value updated successfully', updatedStatus });
        })
        .catch(error => {
            res.status(500).json({ message: 'Failed to update pay value', error: error.message });
        });
});



app.post('/updatePay', (req, res) => {
    const { semester, rollNo, newPayValue } = req.body;
    console.log('Received semester:', semester);
    console.log('Received rollNo:', rollNo);
    console.log('payment status:', newPayValue);
    Fee.findOneAndUpdate({ semester, rollNo }, { pay: newPayValue }, { new: true })
        .then(updatedFee => {
            res.status(200).json({ message: 'Pay value updated successfully', updatedFee });
        })
        .catch(error => {
            res.status(500).json({ message: 'Failed to update pay value', error: error.message });
        });
        User.findOneAndUpdate({ rollNo }, { semester:semester }, { new: true })
        // User.findOneAndUpdate({ rollNo }, { semester:semester }, { new: true })
        // .then(updatedFee => {
        //     res.status(200).json({ message: 'move to next semester', updatedFee });
        // })
        // .catch(error => {
        //     res.status(500).json({ message: 'Failed to update pay value', error: error.message });
        // });
});


//port forr hosting
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
