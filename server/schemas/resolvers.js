const { User, Book } = require('../models')

const resolvers = {
    Query: {
//get a single user by either id or username
        me: async(parent, args, context) => {
            if (context.user){
                const userData = await User.findOne({_id: context.user._id})
                    .select('-__v -password')
                    .populate('savedBooks')
                    .populate('bookCount')
                    .populate('email')
                
                return userData;
            }

            throw new AuthenticationError('Not logged in')
        }
    },

    Mutation: {
        addUser: async (parent, args) =>{
            const user = await User.create(args);
            const token = signToken(user);

            return {token, user};
        },

        login: async (parent, {email, password}) => {
            const user = await User.findone({ email });

            if(!user) {
                throw new AuthenticationError('Incorrect credentials');
            }
            
            const correctPw = await user.isCorrectPassword(password);

            if(!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
            }
            
            const token = signToken(user);
            return {token, user}
        },

//login a single user
// create a user
        saveBook: async (parent,  book_ID, context) => {
            if (context.user) {
                const updatedBookList = await User.findOneAndUpdate(
                    {_id: context.user._id },
                    { $push: { savedBooks: book_ID }},
                    { new: true, runValidators: true}
                )
                return updatedBookList
            }

            throw new AuthenticationError('You need to be logged in!')
        },

        removeBook: async (parent,  book_ID, context) => {
            if (context.user) {
                const updatedBookList = await User.findOneAndUpdate(
                    {_id: context.user._id },
                    { $pull: { savedBooks: book_ID }},
                    { new: true, runValidators: true}
                )
                return updatedBookList
            }

            throw new AuthenticationError('You need to be logged in!')
        }
// save a book
// delete a book 
    }
}

module.exports = resolvers