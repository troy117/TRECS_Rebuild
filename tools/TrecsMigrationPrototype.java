import java.io.File;
import java.io.FileWriter;
import java.io.PrintWriter;
import java.awt.image.BufferedImage;
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

public class TrecsMigrationPrototype {
    private static final Pattern ONLINE_ORDER_PATTERN = Pattern.compile("ONLINE ORDER\\s*:?\\s*(\\d+)", Pattern.CASE_INSENSITIVE);
    private static final Pattern SENIOR_ORDER_ITEM_PATTERN = Pattern.compile("\"([^\"]+)\"\\s*:\\s*\"([^\"]*)\"");

    private int clientId = 1;
    private int contactId = 1;
    private int templateId = 1;
    private int packagePlanId = 1;
    private int packageCodeId = 1;
    private int packageCodeItemId = 1;
    private int jobId = 1;
    private int subjectId = 1;
    private int groupId = 1;
    private int groupMemberId = 1;
    private int orderId = 1;
    private int orderItemId = 1;
    private int subjectCodeId = 1;
    private int imageAssetId = 1;
    private int subjectImageId = 1;
    private int imageVersionId = 1;
    private int migrationSourceId = 1;
    private int legacyMappingId = 1;

    private final Map<String, Integer> clientIdsByTrecsName = new HashMap<>();
    private final Map<String, Integer> templateIdsByName = new HashMap<>();
    private final Map<String, Integer> packagePlanIdsByName = new LinkedHashMap<>();
    private final Map<String, Integer> jobIdsByLocationAndName = new HashMap<>();
    private final Map<String, Integer> subjectIdsByRef = new HashMap<>();
    private final Map<String, Integer> groupIdsByName = new HashMap<>();
    private final Map<String, Integer> imageAssetIdsByJobAndFilename = new HashMap<>();

    private PrintWriter out;
    private int programDataSourceId;
    private int fallSourceId;
    private int seniorSourceId;

    public static void main(String[] args) throws Exception {
        String outputSql = args.length > 0 ? args[0] : "database/migration_prototype_import.sql";
        String programData = args.length > 1 ? args[1] : "ProgramData.accdb";
        String fallDb = args.length > 2 ? args[2] : "JOBS\\UHS\\FALL_2024\\Database\\Students.accdb";
        String location = args.length > 3 ? args[3] : "UHS";
        String jobName = args.length > 4 ? args[4] : "FALL_2024";
        String seniorDb = args.length > 5 ? args[5] : "JOBS\\UHS\\SENIORS\\Database\\Seniors.accdb";
        String seniorJobName = args.length > 6 ? args[6] : "SENIORS";

        new TrecsMigrationPrototype().run(outputSql, programData, fallDb, location, jobName, seniorDb, seniorJobName);
    }

    private void run(String outputSql, String programData, String fallDb, String location, String jobName, String seniorDb, String seniorJobName) throws Exception {
        File output = new File(outputSql);
        File parent = output.getParentFile();
        if (parent != null) {
            parent.mkdirs();
        }

        try (PrintWriter writer = new PrintWriter(new FileWriter(output))) {
            out = writer;
            out.println("BEGIN TRANSACTION;");
            programDataSourceId = addMigrationSource("program_data", programData, "{\"prototype\":true}");
            fallSourceId = addMigrationSource("fall_students", fallDb, "{\"location\":" + sqlJson(location) + ",\"job\":" + sqlJson(jobName) + "}");
            seniorSourceId = addMigrationSource("senior_students", seniorDb, "{\"location\":" + sqlJson(location) + ",\"job\":" + sqlJson(seniorJobName) + "}");

            try (Database db = DatabaseBuilder.open(new File(programData))) {
                importSchools(db.getTable("Schools"));
                importIdTemplates(db.getTable("IDtemplate"));
                importPackagePlans(db.getTable("PackagePlans"));
                importJobs(db.getTable("Jobs"));
            }

            Integer targetJobId = jobIdsByLocationAndName.get(jobKey(location, jobName));
            if (targetJobId == null) {
                throw new IllegalStateException("Could not find target job in ProgramData: " + location + " / " + jobName);
            }

            try (Database db = DatabaseBuilder.open(new File(fallDb))) {
                importFallStudents(db.getTable("Students"), targetJobId);
                importLists(db.getTable("Lists"), targetJobId);
            }
            importImageFolder(targetJobId, "JOBS\\" + location + "\\" + jobName + "\\CroppedMed", "cropped_med", "primary");
            importImageFolder(targetJobId, "JOBS\\" + location + "\\" + jobName + "\\CroppedLarge", "cropped_large", "primary");
            importImageFolder(targetJobId, "JOBS\\" + location + "\\" + jobName + "\\CroppedSmall", "cropped_small", "primary");

            Integer seniorJobId = jobIdsByLocationAndName.get(jobKey(location, seniorJobName));
            if (seniorJobId != null && new File(seniorDb).exists()) {
                importImageFolder(seniorJobId, "JOBS\\" + location + "\\" + seniorJobName + "\\Images", "original", "proof");
                importImageFolder(seniorJobId, "JOBS\\" + location + "\\" + seniorJobName + "\\CroppedMed", "cropped_med", "proof");
                importImageFolder(seniorJobId, "JOBS\\" + location + "\\" + seniorJobName + "\\CroppedLarge", "cropped_large", "proof");
                importImageFolder(seniorJobId, "JOBS\\" + location + "\\" + seniorJobName + "\\Chosen", "chosen", "chosen");
                try (Database db = DatabaseBuilder.open(new File(seniorDb))) {
                    importSeniorStudents(db.getTable("Students"), seniorJobId);
                    try {
                        importLists(db.getTable("Lists"), seniorJobId);
                    } catch (Exception ignored) {
                        // Some senior databases may not have Lists.
                    }
                }
                importImageFolder(seniorJobId, "JOBS\\" + location + "\\" + seniorJobName + "\\Images", "original", "proof");
                importImageFolder(seniorJobId, "JOBS\\" + location + "\\" + seniorJobName + "\\CroppedMed", "cropped_med", "proof");
                importImageFolder(seniorJobId, "JOBS\\" + location + "\\" + seniorJobName + "\\CroppedLarge", "cropped_large", "proof");
                importImageFolder(seniorJobId, "JOBS\\" + location + "\\" + seniorJobName + "\\Chosen", "chosen", "chosen");
            }

            out.println("COMMIT;");
        }

        System.out.println("Wrote " + output.getPath());
    }

    private int addMigrationSource(String sourceType, String sourcePath, String metadataJson) {
        int id = migrationSourceId++;
        out.println("INSERT INTO migration_sources (id, source_type, source_path, metadata_json) VALUES (" +
                id + ", " + sql(sourceType) + ", " + sql(sourcePath) + ", " + sql(metadataJson) + ");");
        return id;
    }

    private void importSchools(Table schools) {
        for (Row row : schools) {
            String ref = text(row, "ReferenceNumber");
            String schoolName = text(row, "SchoolName");
            String trecsName = text(row, "TrecsName");
            if (trecsName.isEmpty() && schoolName.isEmpty()) {
                continue;
            }

            int id = clientId++;
            String displayName = schoolName.isEmpty() ? trecsName : schoolName;
            clientIdsByTrecsName.put(trecsName, id);

            out.println("INSERT INTO clients (id, reference_number, display_name, trecs_name, phone, address, city, state, zip, notes) VALUES (" +
                    id + ", " + sql(ref) + ", " + sql(displayName) + ", " + sql(trecsName) + ", " +
                    sql(text(row, "Phone")) + ", " + sql(text(row, "Address")) + ", " + sql(text(row, "City")) + ", " +
                    sql(text(row, "State")) + ", " + sql(text(row, "Zipcode")) + ", " + sql(text(row, "Notes")) + ");");
            legacy(programDataSourceId, "Schools", ref, "clients", id, row.toString());

            addContact(id, row, 1);
            addContact(id, row, 2);
            addContact(id, row, 3);
        }
    }

    private void addContact(int clientIdValue, Row row, int number) {
        String name = text(row, "Contact" + number + "Name");
        String position = text(row, "Contact" + number + "Position");
        String email = text(row, "Contact" + number + "Email");
        if (name.isEmpty() && position.isEmpty() && email.isEmpty()) {
            return;
        }

        int id = contactId++;
        out.println("INSERT INTO client_contacts (id, client_id, name, position, email, sort_order) VALUES (" +
                id + ", " + clientIdValue + ", " + sql(name) + ", " + sql(position) + ", " + sql(email) + ", " + number + ");");
    }

    private void importIdTemplates(Table idTemplates) {
        for (Row row : idTemplates) {
            String plan = text(row, "Plan");
            if (plan.isEmpty() || templateIdsByName.containsKey(plan)) {
                continue;
            }

            int id = templateId++;
            templateIdsByName.put(plan, id);
            out.println("INSERT INTO templates (id, name, template_type, metadata_json) VALUES (" +
                    id + ", " + sql(plan) + ", 'id_card', " + sql("{\"legacy\":\"ProgramData.IDtemplate\"}") + ");");
            legacy(programDataSourceId, "IDtemplate", plan, "templates", id, row.toString());
        }
    }

    private void importPackagePlans(Table packagePlans) {
        for (Row row : packagePlans) {
            String plan = text(row, "PackagePlan");
            String code = text(row, "Code");
            if (plan.isEmpty() || code.isEmpty()) {
                continue;
            }

            Integer planId = packagePlanIdsByName.get(plan);
            if (planId == null) {
                planId = packagePlanId++;
                packagePlanIdsByName.put(plan, planId);
                out.println("INSERT INTO package_plans (id, name, version, legacy_name) VALUES (" +
                        planId + ", " + sql(plan) + ", 1, " + sql(plan) + ");");
                legacy(programDataSourceId, "PackagePlans", plan, "package_plans", planId, row.toString());
            }

            int codeId = packageCodeId++;
            String codeName = text(row, "CodeName");
            out.println("INSERT INTO package_codes (id, package_plan_id, code, name, legacy_code_name) VALUES (" +
                    codeId + ", " + planId + ", " + sql(code) + ", " + sql(codeName) + ", " + sql(codeName) + ");");
            legacy(programDataSourceId, "PackagePlans", plan + ":" + code, "package_codes", codeId, row.toString());

            for (int i = 1; i <= 15; i++) {
                String field = "f" + i;
                String rawValue = text(row, field);
                if (rawValue.isEmpty()) {
                    continue;
                }
                int itemId = packageCodeItemId++;
                out.println("INSERT INTO package_code_items (id, package_code_id, legacy_field, raw_value, quantity, sort_order) VALUES (" +
                        itemId + ", " + codeId + ", " + sql(field) + ", " + sql(rawValue) + ", 1, " + i + ");");
            }
        }
    }

    private void importJobs(Table jobs) {
        for (Row row : jobs) {
            String location = text(row, "Location");
            String name = text(row, "JobName");
            if (location.isEmpty() || name.isEmpty()) {
                continue;
            }

            Integer clientIdValue = clientIdsByTrecsName.get(location);
            if (clientIdValue == null) {
                clientIdValue = clientId++;
                clientIdsByTrecsName.put(location, clientIdValue);
                out.println("INSERT INTO clients (id, display_name, trecs_name) VALUES (" + clientIdValue + ", " + sql(location) + ", " + sql(location) + ");");
            }

            String packagePlan = text(row, "PackagePlan");
            Integer planId = packagePlanIdsByName.get(packagePlan);
            Integer studentTemplateId = templateIdsByName.get(text(row, "STU_ID"));
            Integer facultyTemplateId = templateIdsByName.get(text(row, "FAC_ID"));
            String type = mapJobType(text(row, "Type"));
            int id = jobId++;
            jobIdsByLocationAndName.put(jobKey(location, name), id);

            out.println("INSERT INTO jobs (id, client_id, legacy_id, reference_number, name, type, package_plan_id, student_id_template_id, faculty_id_template_id, root_path, notes) VALUES (" +
                    id + ", " + clientIdValue + ", " + sql(text(row, "ID")) + ", " + sql(text(row, "ReferenceNumber")) + ", " +
                    sql(name) + ", " + sql(type) + ", " + nullable(planId) + ", " + nullable(studentTemplateId) + ", " +
                    nullable(facultyTemplateId) + ", " + sql("JOBS\\" + location + "\\" + name) + ", " + sql(text(row, "Notes")) + ");");
            legacy(programDataSourceId, "Jobs", text(row, "ID"), "jobs", id, row.toString());
        }
    }

    private void importFallStudents(Table students, int targetJobId) {
        for (Row row : students) {
            String ref = text(row, "RefNum");
            if (ref.isEmpty()) {
                continue;
            }

            int id = subjectId++;
            subjectIdsByRef.put(subjectKey(targetJobId, ref), id);
            String first = text(row, "First");
            String last = text(row, "Last");
            String display = (first + " " + last).trim();
            String photoStatus = bool(row, "Photo") ? "photographed" : "not_photographed";

            out.println("INSERT INTO subjects (id, job_id, legacy_ref_num, subject_type, first_name, last_name, display_name, external_id, grade, homeroom, track, photographed_status, notes) VALUES (" +
                    id + ", " + targetJobId + ", " + sql(ref) + ", 'student', " + sql(first) + ", " + sql(last) + ", " +
                    sql(display) + ", " + sql(text(row, "StuID")) + ", " + sql(text(row, "Grade")) + ", " +
                    sql(text(row, "Homeroom")) + ", " + sql(text(row, "Track")) + ", " + sql(photoStatus) + ", " + sql(text(row, "Notes")) + ");");
            legacy(fallSourceId, "Students", ref, "subjects", id, row.toString());

            importLegacyOrder(targetJobId, id, row, "Order1", "Order1Pay", "paper");
            importLegacyOrder(targetJobId, id, row, "Order2", "Order2Pay", "online");
        }
    }

    private void importLegacyOrder(int jobIdValue, int subjectIdValue, Row row, String orderColumn, String payColumn, String source) {
        String rawCode = text(row, orderColumn);
        if (rawCode.isEmpty()) {
            return;
        }

        String notes = text(row, "Notes");
        String sourceReference = source.equals("online") ? onlineOrderReference(notes) : "";
        String paidStatus = bool(row, payColumn) ? "paid" : "unpaid";
        String renderStatus = bool(row, "Photo") ? "ready" : "not_ready";
        int id = orderId++;

        out.println("INSERT INTO orders (id, job_id, subject_id, source, source_reference, entry_timing, status, paid_status, render_status, notes) VALUES (" +
                id + ", " + jobIdValue + ", " + subjectIdValue + ", " + sql(source) + ", " + sql(sourceReference) + ", 'unknown', 'open', " +
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

    private void importLists(Table lists, int targetJobId) {
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
                out.println("INSERT INTO subject_groups (id, job_id, name, group_type) VALUES (" +
                        groupIdValue + ", " + targetJobId + ", " + sql(listName) + ", 'list');");
            }

            Integer subjectIdValue = subjectIdsByRef.get(subjectKey(targetJobId, ref));
            if (subjectIdValue == null) {
                continue;
            }

            int id = groupMemberId++;
            out.println("INSERT OR IGNORE INTO subject_group_members (id, group_id, subject_id, sort_order) VALUES (" +
                    id + ", " + groupIdValue + ", " + subjectIdValue + ", " + id + ");");
        }
    }

    private void importSeniorStudents(Table seniors, int targetJobId) {
        for (Row row : seniors) {
            String ref = text(row, "RefNum");
            if (ref.isEmpty()) {
                continue;
            }

            int id = subjectId++;
            subjectIdsByRef.put(subjectKey(targetJobId, ref), id);
            String first = text(row, "First");
            String last = text(row, "Last");
            String display = (first + " " + last).trim();

            out.println("INSERT INTO subjects (id, job_id, legacy_ref_num, subject_type, first_name, last_name, display_name, external_id, homeroom, photographed_status, notes) VALUES (" +
                    id + ", " + targetJobId + ", " + sql(ref) + ", 'senior', " + sql(first) + ", " + sql(last) + ", " +
                    sql(display) + ", " + sql(text(row, "StuID")) + ", " + sql(text(row, "Homeroom")) + ", 'unknown', " + sql(text(row, "Notes")) + ");");
            legacy(seniorSourceId, "Students", ref, "subjects", id, row.toString());

            String code = text(row, "Code");
            if (!code.isEmpty()) {
                int codeId = subjectCodeId++;
                out.println("INSERT INTO subject_codes (id, subject_id, code_type, code) VALUES (" +
                        codeId + ", " + id + ", 'gallery', " + sql(code) + ");");
            }

            importSeniorOrders(targetJobId, id, row);
        }
    }

    private void importSeniorOrders(int jobIdValue, int subjectIdValue, Row row) {
        String ordersJson = text(row, "Orders");
        if (ordersJson.isEmpty() || ordersJson.equals("{}")) {
            return;
        }

        String notes = text(row, "Notes");
        String sourceReference = onlineOrderReference(notes);
        int id = orderId++;
        out.println("INSERT INTO orders (id, job_id, subject_id, source, source_reference, entry_timing, status, paid_status, render_status, notes) VALUES (" +
                id + ", " + jobIdValue + ", " + subjectIdValue + ", " + sql(sourceReference.isEmpty() ? "import" : "online") + ", " +
                sql(sourceReference) + ", 'unknown', 'open', 'unknown', 'ready', " + sql(notes) + ");");

        Matcher matcher = SENIOR_ORDER_ITEM_PATTERN.matcher(ordersJson);
        while (matcher.find()) {
            String imageFilename = matcher.group(1);
            String rawCode = matcher.group(2);
            String[] tokens = rawCode.split("\\.");
            for (String token : tokens) {
                String packageCode = token.trim();
                if (packageCode.isEmpty()) {
                    continue;
                }

                int itemId = orderItemId++;
                Integer imageAssetIdValue = imageAssetIdsByJobAndFilename.get(imageKey(jobIdValue, imageFilename));
                out.println("INSERT INTO order_items (id, order_id, subject_id, image_asset_id, package_code, quantity, raw_code, status, notes) VALUES (" +
                        itemId + ", " + id + ", " + subjectIdValue + ", " + nullable(imageAssetIdValue) + ", " + sql(packageCode) + ", 1, " + sql(rawCode) + ", 'open', " +
                        sql("Senior image filename: " + imageFilename) + ");");
            }
        }
    }

    private void importImageFolder(int targetJobId, String folderPath, String versionType, String subjectRole) {
        File folder = new File(folderPath);
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
            String assetKey = imageKey(targetJobId, filename);
            Integer assetId = imageAssetIdsByJobAndFilename.get(assetKey);
            if (assetId == null) {
                assetId = imageAssetId++;
                imageAssetIdsByJobAndFilename.put(assetKey, assetId);
                String source = versionType.equals("original") ? "original" : "legacy_" + versionType;
                out.println("INSERT INTO image_assets (id, job_id, original_path, current_path, filename, source, status) VALUES (" +
                        assetId + ", " + targetJobId + ", " + sql(file.getPath()) + ", " + sql(file.getPath()) + ", " +
                        sql(filename) + ", " + sql(source) + ", 'imported');");
            }

            int versionId = imageVersionId++;
            int[] dimensions = imageDimensions(file);
            out.println("INSERT OR IGNORE INTO image_versions (id, image_asset_id, version_type, path, width, height) VALUES (" +
                    versionId + ", " + assetId + ", " + sql(versionType) + ", " + sql(file.getPath()) + ", " +
                    dimensions[0] + ", " + dimensions[1] + ");");

            String ref = referenceFromImageFilename(filename);
            Integer subjectIdValue = subjectIdsByRef.get(subjectKey(targetJobId, ref));
            if (subjectIdValue != null) {
                int selected = subjectRole.equals("chosen") || subjectRole.equals("primary") ? 1 : 0;
                int linkId = subjectImageId++;
                out.println("INSERT OR IGNORE INTO subject_images (id, subject_id, image_asset_id, role, selected) VALUES (" +
                        linkId + ", " + subjectIdValue + ", " + assetId + ", " + sql(subjectRole) + ", " + selected + ");");
                if (selected == 1 && !subjectRole.equals("proof")) {
                    out.println("UPDATE subjects SET primary_image_asset_id = COALESCE(primary_image_asset_id, " + assetId + ") WHERE id = " + subjectIdValue + ";");
                }
            }
        }
    }

    private void legacy(int sourceId, String legacyTable, String legacyKey, String newTable, int newId, String raw) {
        if (legacyKey == null || legacyKey.isEmpty()) {
            return;
        }
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

    private static boolean isImage(File file) {
        String name = file.getName().toLowerCase();
        return name.endsWith(".jpg") || name.endsWith(".jpeg") || name.endsWith(".png");
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

    private static String referenceFromImageFilename(String filename) {
        String name = filename;
        int dot = name.indexOf('.');
        if (dot >= 0) {
            name = name.substring(0, dot);
        }
        int seniorSeparator = name.indexOf("__");
        if (seniorSeparator >= 0) {
            return name.substring(0, seniorSeparator);
        }
        int underscore = name.indexOf('_');
        if (underscore >= 0) {
            return name.substring(0, underscore);
        }
        return name;
    }

    private static String onlineOrderReference(String notes) {
        Matcher matcher = ONLINE_ORDER_PATTERN.matcher(notes);
        return matcher.find() ? matcher.group(1) : "";
    }

    private static String mapJobType(String raw) {
        String type = raw.toUpperCase();
        if (type.equals("QREVENT")) {
            return "qr_event";
        }
        return type.toLowerCase();
    }

    private static String jobKey(String location, String jobName) {
        return location + "\n" + jobName;
    }

    private static String subjectKey(int jobId, String ref) {
        return jobId + "\n" + ref;
    }

    private static String imageKey(int jobId, String filename) {
        return jobId + "\n" + filename.toLowerCase();
    }

    private static String nullable(Integer value) {
        return value == null ? "NULL" : value.toString();
    }

    private static String sql(String value) {
        if (value == null || value.isEmpty()) {
            return "NULL";
        }
        return "'" + value.replace("'", "''") + "'";
    }

    private static String sqlJson(String value) {
        if (value == null) {
            return "null";
        }
        return "\"" + value.replace("\\", "\\\\").replace("\"", "\\\"") + "\"";
    }
}
