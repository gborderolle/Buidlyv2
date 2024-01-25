﻿using Buildyv2.Context;

namespace Buildyv2;

public class LogService : ILogService
{
    private readonly ContextDB _context;
    public LogService(ContextDB context)
    {
        _context = context;
    }

    public async Task LogAction(string entity, string action, string username, string data)
    {
        var log = new Log { Entity = entity, Action = action, Username = username, Data = data, Creation = DateTime.Now };
        _context.Log.Add(log);
        await _context.SaveChangesAsync();
    }
}