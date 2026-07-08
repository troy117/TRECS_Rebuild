package photo.software.student.capture;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.PrintWriter;
import java.util.Calendar;

import javax.swing.JOptionPane;

public class CaptureLogger 
{
	String logPath, chosenLog, user;
	public CaptureLogger(String user)
	{
		this.logPath = "TrecsHotFolder\\_log.txt";
		this.chosenLog = "TrecsHotFolder\\_chosen.txt";
		this.user = user;
	}
	public CaptureLogger(String path, String user)
	{
		this.logPath = path;
		this.user = user;
	}
	public void write(String line)
	{
		try{
			PrintWriter out = new PrintWriter(new BufferedWriter(new FileWriter(logPath,true)));
			out.println(user+": \t"+Calendar.getInstance().getTime()+"\t"+line);
			out.close();
		}catch(Exception e){JOptionPane.showMessageDialog(null,"Error adding line to log: "+line);}
	}
	public void writeChosenLog(String line)
	{
		try{
			PrintWriter out = new PrintWriter(new BufferedWriter(new FileWriter(chosenLog,true)));
			out.println(user+": \t"+Calendar.getInstance().getTime()+"\tChosen\t"+line);
			out.close();
		}catch(Exception e){JOptionPane.showMessageDialog(null,"Error adding line to chosenLog: "+line);}
	}
}
