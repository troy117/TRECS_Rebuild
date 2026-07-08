import java.io.File;
import java.util.Set;

import com.healthmarketscience.jackcess.Column;
import com.healthmarketscience.jackcess.Database;
import com.healthmarketscience.jackcess.DatabaseBuilder;
import com.healthmarketscience.jackcess.Table;

public class AccessSchemaInspector {
    public static void main(String[] args) throws Exception {
        if (args.length == 0) {
            System.err.println("Usage: java AccessSchemaInspector <file.accdb> [<file.accdb>...]");
            System.exit(1);
        }

        for (String arg : args) {
            File file = new File(arg);
            System.out.println("# " + file.getPath());
            try (Database db = DatabaseBuilder.open(file)) {
                Set<String> tableNames = db.getTableNames();
                for (String tableName : tableNames) {
                    Table table = db.getTable(tableName);
                    int rows = 0;
                    for (Object ignored : table) {
                        rows++;
                    }

                    System.out.println("## " + tableName + " (" + rows + " rows)");
                    for (Column column : table.getColumns()) {
                        System.out.println("- " + column.getName() + " : " + column.getType());
                    }
                    System.out.println();
                }
            }
        }
    }
}
