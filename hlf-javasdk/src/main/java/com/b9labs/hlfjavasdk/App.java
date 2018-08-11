
package com.b9labs.hlfjavasdk;
/**
 * Hello world!
 *
 */

import java.security.PrivateKey;
import java.util.Set;

import org.hyperledger.fabric.sdk.Enrollment;
import org.hyperledger.fabric.sdk.HFClient;
import org.hyperledger.fabric.sdk.User;

public class App implements User{
    private final PrivateKey privateKey;
    private final String cert;

    public App(PrivateKey privateKey, String cert){
        this.privateKey = privateKey;
        this.cert = cert;
    }

    public String getAccount(){
        return null;
    }

    public String getAffiliation(){
        return null;
    }

   
    public static void main( String[] args )
    {
        System.out.println( "Hello World!" );
        
    }

	public String getName() {
		// TODO Auto-generated method stub
		return null;
	}

	public Set<String> getRoles() {
		// TODO Auto-generated method stub
		return null;
	}

	public Enrollment getEnrollment() {
		// TODO Auto-generated method stub
		return null;
	}

	public String getMspId() {
		// TODO Auto-generated method stub
		return null;
	}
}
