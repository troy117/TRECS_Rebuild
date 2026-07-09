import java.io.File;
import java.util.ArrayList;
import java.util.List;

import com.healthmarketscience.jackcess.Database;
import com.healthmarketscience.jackcess.DatabaseBuilder;
import com.healthmarketscience.jackcess.Row;
import com.healthmarketscience.jackcess.Table;

public class AccessJobImportJson {
    private static final String[] STUDENT_COLUMNS = {
        "RefNum",
        "First",
        "Last",
        "StuID",
        "Grade",
        "Homeroom",
        "Track",
        "Photo",
        "Notes",
        "Field1",
        "Field2",
        "Order1",
        "Order1Pay",
        "Order2",
        "Order2Pay"
    };

    private static final String[] LIST_COLUMNS = {
        "List",
        "ReferenceNumber"
    };

    public static void main(String[] args) throws Exception {
        if (args.length < 1) {
            System.err.println("Usage: java AccessJobImportJson <students.accdb>");
            System.exit(1);
        }

        File databaseFile = new File(args[0]);
        StringBuilder output = new StringBuilder();
        output.append("{\"students\":");

        try (Database database = DatabaseBuilder.open(databaseFile)) {
            appendRows(output, database.getTable("Students"), STUDENT_COLUMNS);
            output.append(",\"lists\":");
            Table lists = database.getTable("Lists");
            if (lists == null) {
                output.append("[]");
            } else {
                appendRows(output, lists, LIST_COLUMNS);
            }
        }

        output.append("}");
        System.out.println(output.toString());
    }

    private static void appendRows(StringBuilder output, Table table, String[] columns) throws Exception {
        List<String> availableColumns = new ArrayList<>();
        table.getColumns().forEach(column -> availableColumns.add(column.getName()));

        output.append("[");
        boolean firstRow = true;
        for (Row row : table) {
            if (!firstRow) {
                output.append(",");
            }
            firstRow = false;
            output.append("{");
            for (int index = 0; index < columns.length; index++) {
                String column = columns[index];
                if (index > 0) {
                    output.append(",");
                }
                output.append("\"").append(json(column)).append("\":");
                Object value = availableColumns.contains(column) ? row.get(column) : null;
                appendJsonValue(output, value);
            }
            output.append("}");
        }
        output.append("]");
    }

    private static void appendJsonValue(StringBuilder output, Object value) {
        if (value == null) {
            output.append("null");
        } else if (value instanceof Boolean) {
            output.append(((Boolean) value).booleanValue() ? "true" : "false");
        } else {
            output.append("\"").append(json(value.toString())).append("\"");
        }
    }

    private static String json(String value) {
        return value
            .replace("\\", "\\\\")
            .replace("\"", "\\\"")
            .replace("\r", "\\r")
            .replace("\n", "\\n")
            .replace("\t", "\\t");
    }
}
