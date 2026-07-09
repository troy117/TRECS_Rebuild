import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileWriter;
import java.io.PrintWriter;
import java.util.Arrays;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.imageio.ImageIO;

import com.healthmarketscience.jackcess.Database;
import com.healthmarketscience.jackcess.DatabaseBuilder;
import com.healthmarketscience.jackcess.Row;
import com.healthmarketscience.jackcess.Table;

public class SingleJobImportSql {
    private static final Pattern ONLINE_ORDER_PATTERN = Pattern.compile("ONLINE ORDER\\s*:?\\s*(\\d+)", Pattern.CASE_INSENSITIVE);

    private int clientId = 1000;
    private int jobId = 1000;
    private int subjectId = 1000;
    private int orderId = 1000;
    private int orderItemId = 1000;
    private int groupId = 1000;
    private int groupMemberId = 1000;
    private int imageAssetId = 1000;
    private int imageVersionId = 1000;
    private int subjectImageId = 1000;
    private int migrationSourceId = 1000;
    private int legacyMappingId = 1000;

    private final Map<String, Integer> subjectIdsByRef = new HashMap<>();
    private final Map<String, Integer> groupIdsByName = new LinkedHashMap<>();
    private final Map<String, Integer> imageAssetIdsByFilename = new HashMap<>();

    private PrintWriter out;
    private int sourceId;

    public static void main(String[] args) throws Exception {
        if (args.length < 5) {
            System.err.println("Usage: java SingleJobImportSql <output.sql> <jobRoot> <students.accdb> <clientName> <jobName>");
            System.exit(1);
        }

        new SingleJobImportSql().run(args[0], args[1], args[2], args[3], args[4]);
    }

    private void run(String outputSql, String jobRoot, String studentsDb, String clientName, String jobName) throws Exception {
        File output = new File(outputSql);
        File parent = output.getParentFile();
        if (parent != null) {
            parent.mkdirs();
        }

        try (PrintWriter writer = new PrintWriter(new FileWriter(output))) {
            out = writer;
            out.println("BEGIN TRANSACTION;");
            sourceId = migrationSourceId++;
            out.println("INSERT OR IGNORE INTO migration_sources (id, source_type, source_path, metadata_json) VALUES (" +
                    sourceId + ", 'single_job_access', " + sql(studentsDb) + ", " + sql("{\"client\":\"" + json(clientName) + "\",\"job\":\"" + json(jobName) + "\"}") + ");");

            out.println("INSERT OR IGNORE INTO clients (id, display_name, trecs_name, notes) VALUES (" +
                    clientId + ", " + sql(clientName) + ", " + sql(clientName) + ", 'Imported from single-job test folder.');");
            out.println("INSERT OR IGNORE INTO jobs (id, client_id, reference_number, name, type, root_path, notes) VALUES (" +
                    jobId + ", " + clientId + ", '2025', " + sql(jobName) + ", 'fall', " + sql(jobRoot) + ", 'Imported from Import/Bud Rank 2025 for testing.');");

            try (Database db = DatabaseBuilder.open(new File(studentsDb))) {
                importStudents(db.getTable("Students"));
                importLists(db.getTable("Lists"));
            }

            importImageFolder(new File(jobRoot, "CroppedMed"), "cropped_med");
            importImageFolder(new File(jobRoot, "CroppedLarge"), "cropped_large");
            out.println("COMMIT;");
        }

        System.out.println("Wrote " + output.getPath());
    }

    private void importStudents(Table students) {
        for (Row row : students) {
            String ref = text(row, "RefNum");
            if (ref.isEmpty()) {
                continue;
            }

            int id = subjectId++;
            subjectIdsByRef.put(ref, id);
            String first = text(row, "First");
            String last = text(row, "Last");
            String display = (first + " " + last).trim();
            String grade = text(row, "Grade");
            String subjectType = grade.equalsIgnoreCase("FAC") ? "faculty" : "student";
            String photoStatus = bool(row, "Photo") ? "photographed" : "not_photographed";
            String notes = mergedNotes(row);

            out.println("INSERT OR IGNORE INTO subjects (id, job_id, legacy_ref_num, subject_type, first_name, last_name, display_name, external_id, grade, homeroom, track, photographed_status, notes) VALUES (" +
                    id + ", " + jobId + ", " + sql(ref) + ", " + sql(subjectType) + ", " + sql(first) + ", " + sql(last) + ", " +
                    sql(display) + ", " + sql(text(row, "StuID")) + ", " + sql(grade) + ", " + sql(text(row, "Homeroom")) + ", " +
                    sql(text(row, "Track")) + ", " + sql(photoStatus) + ", " + sql(notes) + ");");
            legacy("Students", ref, "subjects", id, row.toString());

            importOrder(id, row, "Order1", "Order1Pay", "paper");
            importOrder(id, row, "Order2", "Order2Pay", "online");
        }
    }

    private String mergedNotes(Row row) {
        String notes = text(row, "Notes");
        String field1 = text(row, "Field1");
        String field2 = text(row, "Field2");
        StringBuilder builder = new StringBuilder(notes);
        if (!field1.isEmpty()) {
            appendNote(builder, "Field1: " + field1);
        }
        if (!field2.isEmpty()) {
            appendNote(builder, "Field2: " + field2);
        }
        return builder.toString();
    }

    private void appendNote(StringBuilder builder, String note) {
        if (builder.length() > 0) {
            builder.append("\n");
        }
        builder.append(note);
    }

    private void importOrder(int subjectIdValue, Row row, String orderColumn, String payColumn, String source) {
        String rawCode = text(row, orderColumn);
        if (rawCode.isEmpty()) {
            return;
        }

        int id = orderId++;
        String notes = text(row, "Notes");
        String sourceReference = source.equals("online") ? onlineOrderReference(notes) : "";
        String paidStatus = bool(row, payColumn) ? "paid" : "unpaid";
        String renderStatus = bool(row, "Photo") ? "ready" : "not_ready";

        out.println("INSERT INTO orders (id, job_id, subject_id, source, source_reference, entry_timing, status, paid_status, render_status, notes) VALUES (" +
                id + ", " + jobId + ", " + subjectIdValue + ", " + sql(source) + ", " + sql(sourceReference) + ", 'unknown', 'open', " +
                sql(paidStatus) + ", " + sql(renderStatus) + ", " + sql(notes) + ");");

        String[] tokens = rawCode.split("\\.");
        for (String token : tokens) {
            String packageCode = token.trim();
            if (packageCode.isEmpty()) {
                continue;
            }

            int itemId = orderItemId++;
            out.println("INSERT INTO order_items (id, order_id, subject_id, package_code, quantity, raw_code, status, notes) VALUES (" +
                    itemId + ", " + id + ", " + subjectIdValue + ", " + sql(packageCode) + ", 1, " + sql(rawCode) + ", 'open', " +
                    sql("Migrated from " + orderColumn) + ");");
        }
    }

    private void importLists(Table lists) {
        for (Row row : lists) {
            String listName = text(row, "List");
            String ref = text(row, "ReferenceNumber");
            if (listName.isEmpty() || ref.isEmpty()) {
                continue;
            }

            Integer groupIdValue = groupIdsByName.get(listName);
            if (groupIdValue == null) {
                groupIdValue = groupId++;
                groupIdsByName.put(listName, groupIdValue);
                out.println("INSERT OR IGNORE INTO subject_groups (id, job_id, name, group_type) VALUES (" +
                        groupIdValue + ", " + jobId + ", " + sql(listName) + ", 'list');");
            }

            Integer subjectIdValue = subjectIdsByRef.get(ref);
            if (subjectIdValue == null) {
                continue;
            }

            int id = groupMemberId++;
            out.println("INSERT OR IGNORE INTO subject_group_members (id, group_id, subject_id, sort_order) VALUES (" +
                    id + ", " + groupIdValue + ", " + subjectIdValue + ", " + id + ");");
        }
    }

    private void importImageFolder(File folder, String versionType) {
        File[] files = folder.listFiles();
        if (files == null) {
            return;
        }

        Arrays.sort(files, (a, b) -> a.getName().compareToIgnoreCase(b.getName()));
        for (File file : files) {
            if (!file.isFile() || !isImage(file)) {
                continue;
            }

            String filename = file.getName();
            String key = filename.toLowerCase();
            Integer assetId = imageAssetIdsByFilename.get(key);
            if (assetId == null) {
                assetId = imageAssetId++;
                imageAssetIdsByFilename.put(key, assetId);
                out.println("INSERT INTO image_assets (id, job_id, original_path, current_path, filename, source, status) VALUES (" +
                        assetId + ", " + jobId + ", " + sql(file.getPath()) + ", " + sql(file.getPath()) + ", " +
                        sql(filename) + ", " + sql("legacy_" + versionType) + ", 'imported');");
            }

            int[] dimensions = imageDimensions(file);
            int versionId = imageVersionId++;
            out.println("INSERT OR IGNORE INTO image_versions (id, image_asset_id, version_type, path, width, height) VALUES (" +
                    versionId + ", " + assetId + ", " + sql(versionType) + ", " + sql(file.getPath()) + ", " + dimensions[0] + ", " + dimensions[1] + ");");

            Integer subjectIdValue = subjectIdsByRef.get(referenceFromImageFilename(filename));
            if (subjectIdValue != null) {
                int linkId = subjectImageId++;
                out.println("INSERT OR IGNORE INTO subject_images (id, subject_id, image_asset_id, role, selected) VALUES (" +
                        linkId + ", " + subjectIdValue + ", " + assetId + ", 'primary', 1);");
                out.println("UPDATE subjects SET primary_image_asset_id = COALESCE(primary_image_asset_id, " + assetId + ") WHERE id = " + subjectIdValue + ";");
            }
        }
    }

    private void legacy(String legacyTable, String legacyKey, String newTable, int newId, String raw) {
        int id = legacyMappingId++;
        out.println("INSERT OR IGNORE INTO legacy_mappings (id, migration_source_id, legacy_table, legacy_key, new_table, new_id, raw_json) VALUES (" +
                id + ", " + sourceId + ", " + sql(legacyTable) + ", " + sql(legacyKey) + ", " + sql(newTable) + ", " + newId + ", " + sql(raw) + ");");
    }

    private static String text(Row row, String column) {
        Object value = row.get(column);
        return value == null ? "" : value.toString().trim();
    }

    private static boolean bool(Row row, String column) {
        Object value = row.get(column);
        if (value == null) {
            return false;
        }
        if (value instanceof Boolean) {
            return (Boolean) value;
        }
        String text = value.toString().trim();
        return text.equalsIgnoreCase("true") || text.equalsIgnoreCase("yes") || text.equals("1");
    }

    private static String onlineOrderReference(String notes) {
        Matcher matcher = ONLINE_ORDER_PATTERN.matcher(notes);
        return matcher.find() ? matcher.group(1) : "";
    }

    private static boolean isImage(File file) {
        String name = file.getName().toLowerCase();
        return name.endsWith(".jpg") || name.endsWith(".jpeg") || name.endsWith(".png");
    }

    private static String referenceFromImageFilename(String filename) {
        int dot = filename.indexOf('.');
        return dot >= 0 ? filename.substring(0, dot) : filename;
    }

    private static int[] imageDimensions(File file) {
        try {
            BufferedImage image = ImageIO.read(file);
            if (image == null) {
                return new int[] {0, 0};
            }
            return new int[] {image.getWidth(), image.getHeight()};
        } catch (Exception e) {
            return new int[] {0, 0};
        }
    }

    private static String sql(String value) {
        if (value == null || value.isEmpty()) {
            return "NULL";
        }
        return "'" + value.replace("'", "''").replace("\u0000", "") + "'";
    }

    private static String json(String value) {
        return value.replace("\\", "\\\\").replace("\"", "\\\"");
    }
}
