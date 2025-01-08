using Projeto_Integrador2.Server.Interface;
using Projeto_Integrador2.Server.Model;
using Projeto_Integrador2.Server.Repository;

namespace Projeto_Integrador2.Server.Transaction
{
    public class SuggestionTRA
    {
        public static void SendSuggestion(IConnection connection, Suggestion suggestion)
        {
            try
            {
                SuggestionRepository suggestionRepositoryBUS = new SuggestionRepository(connection);
                suggestionRepositoryBUS.SendSuggestion(suggestion);
            }
            catch (Exception ex)
            {
                throw;
            }
        }
    }
}
