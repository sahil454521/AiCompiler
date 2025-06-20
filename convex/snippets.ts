import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { title } from "process";



export const createSnippet = mutation({
    args:{
        title:v.string(),
        code:v.string(),
        language:v.string()
    },


    handler: async (ctx,args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized: User not authenticated");
         
        
        const user = await ctx.db 
        .query('users')
        .withIndex('by_user_id')
        .filter(q => q.eq(q.field('userId'), identity.subject))
        .first();

        if (!user) throw new Error("Unauthorized: User not found");

        const snippetId = await ctx.db.insert("snippets", {
            userName: user.name,
            userId: identity.subject
            title: args.title,
            code: args.code,
            language: args.language,
        
        })

        return snippetId;
  
  
  
    }
})