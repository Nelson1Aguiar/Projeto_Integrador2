namespace Projeto_Integrador2.Server.Interface
{
    public interface IRepository<T> where T : class
    {
        void Create(T entity);
        void Delete(long id);
        void Update(T entity);
        void GetOne(T entity);
        List<T> GetAll();
    }
}
