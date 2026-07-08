import java.io.File;
import java.util.ArrayList;
import java.util.List;

import com.healthmarketscience.jackcess.Database;
import com.healthmarketscience.jackcess.DatabaseBuilder;
import com.healthmarketscience.jackcess.Row;
import com.healthmarketscience.jackcess.Table;

public class AccessTableSampler {
    public static void main(String[] args) throws Exception {
        if (args.length < 2) {
            System.err.println("Usage: java AccessTableSampler <file.accdb> <table> [limit]");
            System.exit(1);
        }

        File file = new File(args[0]);
        String tableName = args[1];
        int limit = args.length >= 3 ? Integer.parseInt(args[2]) : 20;

        try (Database db = DatabaseBuilder.open(file)) {
            Table table = db.getTable(tableName);
            List<String> columns = new ArrayList<>();
            table.getColumns().forEach(column -> columns.add(column.getName()));

            System.out.println("# " + file.getPath() + " :: " + tableName);
            System.out.println(String.join("\t", columns));

            int count = 0;
            for (Row row : table) {
                List<String> values = new ArrayList<>();
                for (String column : columns) {
                    Object value = row.get(column);
                    values.add(value == null ? "" : value.toString().replace("\r", " ").replace("\n", " "));
                }
                System.out.println(String.join("\t", values));
                count++;
                if (count >= limit) {
                    break;
                }
            }
        }
    }
}
