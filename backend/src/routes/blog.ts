import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign,verify } from 'hono/jwt'
  import { createBlogInput, updateBlogInput } from '@chaicodes/medium-common'


export const blogRouter = new Hono<{
	Bindings: {
		DATABASE_URL: string
		JWT_SECRET: string
	},
  Variables : {
		userId: string
	}
}>();


blogRouter.use('/*', async (c, next) => {

	const jwt = c.req.header('Authorization');
	if (!jwt) {
		c.status(401);
		return c.json({ error: "unauthorized" });
	}
	const token = jwt.split(' ')[1];

	
	try{
	const payload = await verify(token, c.env.JWT_SECRET) as { id: string } ;
	if (!payload) {
		c.status(401);
		return c.json({ error: "unauthorized" });
	}
	c.set('userId', payload.id);
	await next()
}
catch(e){
	c.status(403);
	return c.json({ message: "You are not logged in !!!" });
}
})



blogRouter.post('/', async (c) => {
  const body = await c.req.json();
	
	const { success } = createBlogInput.safeParse(body);
	if (!success) {
		c.status(411);
		return c.json({ message: 'invalid input' });
	}

  const authorId = c.get('userId');
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate())

    const blog = await prisma.blog.create({
      data: {
        title:body.title,
        content:body.content,
        authorId: Number(authorId)
     }
  })
  return c.json({
    id: blog.id
  })
})

blogRouter.put('/update/:id', async (c) => {
	const id = Number(c.req.param('id'));
	const userId = c.get('userId');
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());

	try{


	const body = await c.req.json();
	console.log("THE BODY IS: ",body);

	const { success } = createBlogInput.safeParse(body);
	if (!success) {
		c.status(411);
		return c.json({ message: 'invalid input' });
	}


	const updatedPost = await prisma.blog.update({
		

		where: {
			id: id,
			authorId: Number(userId)
		},
		data: {
			title: body.title,
			content: body.content
		}
	});

	
	if(!updatedPost){
		c.status(404);
		return c.text('post not found or unauthorized to update post');
	}

	return c.text('updated post');
} catch(e){

	console.log(e);
	c.status(411);
	return c.text('error updating post');

}
});

blogRouter.get('/bulk', async (c) => {
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());
	
	const posts = await prisma.blog.findMany({
		select:{
			content:true,
			title:true,
			id:true,
			author: {
				select:{
					name:true
				}
				
			}
		}
	});

	return c.json(posts);
})


blogRouter.get('/:id', async (c) => {
	const id = Number(c.req.param('id'));
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());
	
	const post = await prisma.blog.findUnique({
		where: {
			id
		},
		select:{
			id:true,
			title:true,
			content:true,
			author: {
				select:{
					name:true
				}
				
			}
		}
	});

	return c.json(post);
})

blogRouter.delete('/delete/:id', async (c) => {
  const id = Number(c.req.param('id'));
  const userId = c.get('userId');
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const deletedPost = await prisma.blog.delete({
      where: {
        id: id,
        authorId: Number(userId)
      }
    });

    return c.json({ message: 'Post deleted successfully', deletedPost });
  } catch (e) {
    console.error(e);
    if (e) {
      c.status(404);
      return c.json({ message: 'Post not found or unauthorized to delete post' });
    }
    c.status(500);
    return c.json({ message: 'Error deleting post' });
  } finally {
    await prisma.$disconnect();
  }
});
