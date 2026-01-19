import { db } from './index';
import { eq } from 'drizzle-orm';
import {
  users,
  comments,
  products,
  type NewUser,
  type NewComment,
  type NewProduct,
} from './schema';

//* USER QUERIES

export async function createUser(userData: NewUser) {
  const [user] = await db.insert(users).values(userData).returning();
  return user;
}

export async function getUserById(id: string) {
  return db.query.users.findFirst({
    where: eq(users.id, id),
  });
}

export async function updateUser(id: string, updates: Partial<NewUser>) {
  const existineUser = await getUserById(id);
  if (!existineUser) {
    throw new Error('User with id ' + id + ' not found');
  }
  const [user] = await db.update(users).set(updates).where(eq(users.id, id)).returning();
  return user;
}

export async function upsertUser(userData: NewUser) {
  const [user] = await db
    .insert(users)
    .values(userData)
    .onConflictDoUpdate({
      target: users.id,
      set: userData,
    })
    .returning();
  return user;
}

//* PRODUCT QUERIES

export async function createProduct(productData: NewProduct) {
  const [product] = await db.insert(products).values(productData).returning();
  return product;
}

export async function getAllProducts() {
  return db.query.products.findMany({
    with: { user: true },
    orderBy: (products, { desc }) => [desc(products.createdAt)],
  });
}

export async function getProductById(id: string) {
  return db.query.products.findFirst({
    where: eq(products.id, id),
    with: {
      user: true,
      comments: {
        with: { user: true },
        orderBy: (comments, { desc }) => [desc(comments.createdAt)],
      },
    },
  });
}

export async function getProductByUserId(userId: string) {
  return db.query.products.findMany({
    where: eq(products.userId, userId),
    with: { user: true },
    orderBy: (products, { desc }) => [desc(products.createdAt)],
  });
}

export async function updateProduct(id: string, updates: Partial<NewProduct>) {
  const existineproduct = await getProductById(id);
  if (!existineproduct) {
    throw new Error('Product with id ' + id + ' not found');
  }
  const [product] = await db.update(products).set(updates).where(eq(products.id, id)).returning();
  return product;
}

export async function deleteProduct(id: string) {
  const existineproduct = await getProductById(id);
  if (!existineproduct) {
    throw new Error('Product with id ' + id + ' not found');
  }
  const [product] = await db.delete(products).where(eq(products.id, id)).returning();
  return product;
}

//* COMMENT QUERIES

export async function createComment(commentData: NewComment) {
  const [comment] = await db.insert(comments).values(commentData).returning();
  return comment;
}

export async function getCommentById(id: string) {
  return db.query.comments.findFirst({
    where: eq(comments.id, id),
    with: { user: true },
  });
}

export async function deleteComment(id: string) {
  const existinecomment = await getCommentById(id);
  if (!existinecomment) {
    throw new Error('Comment with id ' + id + ' not found');
  }
  const [comment] = await db.delete(comments).where(eq(comments.id, id)).returning();
  return comment;
}
