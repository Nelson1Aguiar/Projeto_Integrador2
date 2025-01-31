namespace Projeto_Integrador2.Server.Interface
{
    public interface IRepository<T> where T : class
    {
        Task Create(T entity);
        Task Delete(long id);
        Task Update(T entity);
        Task GetOne(T entity);
        Task<List<T>> GetAll();
        Task<List<T>> GetPage(int page, int pageSize);
    }
}
