package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"

	"github.com/eoin-barr/gql-postgres-2/graph/common"
	"github.com/eoin-barr/gql-postgres-2/graph/generated"
	"github.com/eoin-barr/gql-postgres-2/graph/model"
)

// CreateTodo is the resolver for the createTodo field.
func (r *mutationResolver) CreateTodo(ctx context.Context, id string, text string) (*model.Todo, error) {
	context := common.GetContext(ctx)

	todo := &model.Todo{
		ID:   id,
		Text: text,
		Done: false,
	}
	err := context.Database.Create(&todo).Error
	if err != nil {
		return nil, err
	}
	return todo, nil
}

// UpdateTodo is the resolver for the updateTodo field.
func (r *mutationResolver) UpdateTodo(ctx context.Context, input model.TodoInput) (*model.Todo, error) {
	context := common.GetContext(ctx)
	todo := &model.Todo{
		Text: input.Text,
		Done: input.Done,
	}
	err := context.Database.Save(&todo).Error
	if err != nil {
		return nil, err
	}
	return todo, nil
}

// DeleteTodo is the resolver for the deleteTodo field.
func (r *mutationResolver) DeleteTodo(ctx context.Context, todoID string) (*model.Todo, error) {
	context := common.GetContext(ctx)
	var todo *model.Todo
	err := context.Database.Where("id = ?", todoID).Delete(&todo).Error
	if err != nil {
		return nil, err
	}
	return todo, nil
}

// GetTodos is the resolver for the getTodos field.
func (r *queryResolver) GetTodos(ctx context.Context) ([]*model.Todo, error) {
	context := common.GetContext(ctx)
	var todos []*model.Todo
	err := context.Database.Find(&todos).Error
	if err != nil {
		return nil, err
	}
	return todos, nil
}

// GetTodo is the resolver for the getTodo field.
func (r *queryResolver) GetTodo(ctx context.Context, todoID string) (*model.Todo, error) {
	context := common.GetContext(ctx)
	var todo *model.Todo
	err := context.Database.Where("id = ?", todoID).First(&todo).Error
	if err != nil {
		return nil, err
	}
	return todo, nil
}

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
