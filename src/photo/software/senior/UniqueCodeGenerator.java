package photo.software.senior;

import java.util.HashSet;
import java.util.Random;
import java.util.Set;

public class UniqueCodeGenerator {
    private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final int CODE_LENGTH = 4;
    private Set<String> existingCodes;
    private Random random;

    public UniqueCodeGenerator() {
        this.existingCodes = new HashSet<>();
        this.random = new Random();
    }

    public String generateUniqueCode() {
        String code;
        do {
            code = generateRandomCode();
        } while (existingCodes.contains(code));

        existingCodes.add(code);
        return code;
    }

    private String generateRandomCode() {
        StringBuilder code = new StringBuilder(CODE_LENGTH);
        for (int i = 0; i < CODE_LENGTH; i++) {
            int index = random.nextInt(CHARACTERS.length());
            code.append(CHARACTERS.charAt(index));
        }
        return code.toString();
    }
    
    public void addExistingCode(String code)
    {
    	existingCodes.add(code);
    }
    public void setexistingCodes(Set<String> existingCodes)
    {
    	this.existingCodes = existingCodes;
    }

}