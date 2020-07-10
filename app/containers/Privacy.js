import React from 'react';
import { Text, View, AsyncStorage, Image, Dimensions, ScrollView } from 'react-native';
import styles from '../assets/styles';
import Unorderedlist from 'react-native-unordered-list';
import {Button} from 'react-native-paper';

class Privacy extends React.Component{
    render(){
        return(
            <View style={{backgroundColor: "rgba(26, 93, 87, 0.15)", width: "100%", height: "100%",}}>
                <Image style={styles.privacyLogo} source={require('../assets/images/Findr_logo2x.png')}/>

                <View style={styles.privacyContainer}>
                    <ScrollView style={styles.scrollPrivacy}>
                    <Text style={styles.privacyHeader}>PRIVACY POLICY</Text>
                    <Text>Welcome to Findr’s Privacy Policy. Thank you for taking the time to read through this.{'\n'}{'\n'}
                        Maintaining the privacy of our users is our top priority. We recognise that your privacy
                        is very important and we appreciate you trusting us with it.
                        This Privacy Policy describes Findr’s policies and procedures on the collection, use, 
                        disclosure and sharing of your information when you use the Findr
                        service via the Findr mobile application or the Findr website (For simplicity,
                        we will refer to both these as our ‘services’ in this Privacy Policy).
                        {'\n'}{'\n'}As we mentioned, we intend to keep your trust and work with you and this document
                        is to make sure you understand the information we collect, why we collect it, 
                        how it is used and your choices regarding your information. </Text>
                    <Text style={styles.privacyHeader}>INFORMATION WE COLLECT</Text>
                    <Text>Findr is meant to help you, as students, develop better connections with peers 
                        from various fields and work more efficiently. Having said that, to help you find 
                        better and more meaningful connections, we would require some basic information 
                        including your basic profile information and your interests.{'\n'} </Text>
                    <Text>We also collect information generated as you use our services, for example access 
                        logs, as well as information from third parties, like when you access our services
                        through a social media account. If you want additional info, we go into more
                        detail below</Text>
                    <Text style={styles.privacyHeader}>INFORMATION YOU GIVE US</Text>
                    <Text>You choose to give us certain information when you use our services.
                        This includes:</Text>
                        <Unorderedlist>
                            <Text>On creation of your account, you provide us with your login 
                                credentials as well as some basic information including name, 
                                gender, date of birth, and your university.</Text>
                        </Unorderedlist>
                        <Unorderedlist>
                        <Text>On the completion of your profile, you provide us with information 
                                on your courses, interests, projects and work experience. Here, you can 
                                also share with us details about your personality and a description of
                                what you are looking for. To add a profile picture, you may give us access
                                to your camera or photo album. Some of this information you provide us 
                                may be considered sensitive in certain jurisdictions (for example, 
                                your gender, race or ethnic origins). By choosing to provide this
                                information, you consent to our processing of that information. </Text>
                        </Unorderedlist>
                        <Unorderedlist>
                            <Text>If you choose to contact our customer care team, we collect that 
                                information during the interaction and this is subsequently used for 
                                training purposes.</Text>
                        </Unorderedlist>
                        <Unorderedlist>
                            <Text>Finally, we will also process your chats with other users 
                                along with all the content you publish. </Text>
                        </Unorderedlist>
                        <Unorderedlist>
                            <Text>If you choose to use the invite option on our service to invite
                            your friends, we will ask for that friend’s email address and automatically 
                            send an email invitation. Findr collects your friend’s email address to 
                            automatically send the invitation and tracks if your invited friends 
                            accepted these requests. Doing so helps us keep a track of the success 
                            rate of these invitations. By providing your friend’s email addresses to us, 
                            you warrant that you have their consent to do so and for Findr to use this 
                            information as described above. </Text>
                        </Unorderedlist>
                        <Text style={styles.privacyHeader}>INFORMATION WE RECEIVE FROM OTHERS</Text>
                        <Text>In addition to the information you provide us, we receive information 
                            about you from other users, including:</Text>
                        <Unorderedlist>
                            <Text>Other users may provide information about you as they use our service. 
                                We may collect information about you from other users if they contact us about you. </Text>
                        </Unorderedlist>   
                        <Text style={styles.privacyHeader}>INFORMATION WE COLLECT
                         WHEN YOU USE OUR SERVICES</Text>
                         <Text>When you use our services, we may collect information about which features 
                             you use, how you used them and which devices you used to access our services.</Text>
                        <Unorderedlist>
                            <Text>When you use our services, we collect information about your activity on 
                                our services. These include - date and time you logged in, features you used, 
                                filters you applied, profiles you visited, users you interacted with, date and
                                time of your interactions and the number of messages you sent to each user.</Text>
                        </Unorderedlist>    
                        <Unorderedlist>
                            <Text>Device information We collect information from and about the device(s) you 
                                use to access our services, including:</Text>
                                <Unorderedlist>
                                    <Text>hardware and software information such as IP address, device 
                                        ID and type, device-specific and apps settings and characteristics, 
                                        app crashes, advertising IDs (such as Google’s AAID and Apple's IDFA,
                                        both of which are randomly generated numbers that you can reset by 
                                        going into your device’ settings), browser type, version and language, 
                                        operating system, time zones, identifiers associated with cookies or 
                                        other technologies that may uniquely identify your device or browser 
                                        (e.g., IMEI/UDID and MAC address);</Text>
                                </Unorderedlist> 
                                <Unorderedlist>
                                    <Text>information on your wireless and mobile network connection,
                                         like your service provider and signal strength;</Text>
                                </Unorderedlist>
                                <Unorderedlist>
                                    <Text>information on device sensors such as accelerometers, 
                                        gyroscopes and compasses.</Text>
                                </Unorderedlist>  
                        </Unorderedlist>  
                        <Unorderedlist>
                            <Text>Other information with your consent If you give us permission,
                                    we can collect your precise geolocation (latitude and longitude) 
                                    through various means, depending on the service and device you’re 
                                    using, including GPS, Bluetooth or Wi-Fi connections. The collection 
                                    of your geolocation may occur in the background even when you aren’t
                                using the services if the permission you gave us expressly permits
                                such collection. If you decline permission for us to collect your
                                geolocation, we will not collect it. Similarly, if you consent,
                                we may collect your photos and videos (for instance, if you want
                                to publish a photo, video or streaming on the services).</Text>
                        </Unorderedlist> 
                        <Text style={styles.privacyHeader}>COOKIES AND OTHER DATA COLLECTION </Text>
                        <Text>We make the use of cookies to make your experience on our app as
                            seamless as possible. Among other things, cookies help us authenticate
                            you and ensure you don’t have to log in each time you use our services.{'\n'}</Text>
                        <Text>Cookies are small text files that are sent to or accessed from your 
                            web browser or your device’s memory. A cookie typically contains the 
                            name of the domain (internet location) from which the cookie originated, 
                            the “lifetime” of the cookie (i.e., when it expires) and a randomly 
                            generated unique number or similar identifier. A cookie also may
                             contain information about your device, such as user settings, 
                             browsing history and activities conducted while using our services.{'\n'} </Text>
                        <Text>Cookies are placed on your device by us to adapt our website 
                            to your browser’s language preferences and to better understand
                             your use of our website. {'\n'}</Text>
                        <Text>Session cookies only last until you close your browser. We use sessional
                             cookies to learn more about your use of our website during one browser
                              session and help you use our website more efficiently. {'\n'}</Text>
                        <Text>Persistent cookies last even after you close your browser. 
                            These are used to help you sign in to our website again and 
                            for analytical purposes.Most browsers can be configured not 
                            to accept cookies and not use local storage.{'\n'}</Text>
                        <Text>The cookies we use are generalised below:{'\n'}</Text>
                        <Unorderedlist>
                            <Text>Authentication and security cookies: We use these cookies to 
                            enable you to remain logged into Team Study, and verify that it
                            is you as you use Team Study. This helps keep your account safe and 
                            secure from unauthorized use, and helps combat spam and other abuse 
                            which violates our policies</Text>
                        </Unorderedlist>
                        <Unorderedlist>
                            <Text>Analytics and research cookies: We use these cookies to better
                                 understand how people use Team Study. For example, how often 
                                 particular features are used, or which content leads towards user activity.</Text>
                        </Unorderedlist>
                        <Unorderedlist>
                            <Text>Product features and setting cookies: We use these cookies to enable the 
                                functionality of some features within the Team Study product, in particular
                                 to personalize the experience towards you. We also use these cookies to store
                                  certain of your preferences and settings.</Text>
                        </Unorderedlist>
                        <Text>Also, Findr does not respond to ‘Do Not Track’ (DNT) signals</Text>
                        <Text style={styles.privacyHeader}>COOKIES AND OTHER DATA COLLECTION </Text>
                        <Unorderedlist>
                            <Text>We use the information we collect to provide you a better and 
                                seamless experience on Findr and managing your account. Also, it
                                 helps us provide you with better customer support. </Text>
                        </Unorderedlist>
                        <Unorderedlist>
                            <Text>We use the data collected to improve the recommendations that are given
                                 to you. We analyze your profile and your activity on our services and 
                                 thereby personalise the preferences and cards that are shown to you.</Text>
                        </Unorderedlist>
                        <Unorderedlist>
                            <Text>We use your data to link new devices to provide a consistent experience
                                 on using our services. We do this by linking the devices and 
                                 browsing data.</Text>
                        </Unorderedlist>
                        <Unorderedlist>
                            <Text>We use the data collected to constantly modify our services and
                                 provide new features to you.</Text>
                        </Unorderedlist>
                        <Unorderedlist>
                            <Text>We use the data you provide to perform data analysis to protect you 
                                and other users from any forbidden (refer to community guidelines) or
                                 illegal activities. </Text>
                        </Unorderedlist>
                        <Unorderedlist>
                            <Text>We use the data to comply with legal requirements and law enforcement. </Text>
                        </Unorderedlist>
                        <Text style={styles.privacyHeader}>HOW WE SHARE YOUR INFORMATION</Text>
                        <Unorderedlist>
                            <Text>We share the information you make public with other users. For example,
                                 when you create a new card and fill out your information, that is available 
                                 to the public. Please be careful with your information and only make that
                                  information public that you are comfortable sharing since neither you nor 
                                  us can control what others do once they see your information.</Text>
                        </Unorderedlist>
                        <Unorderedlist>
                            <Text>We may disclose your information if reasonably necessary: {'\n'}
                                 (i) to comply with a legal process, such as a court order, subpoena or 
                                search warrant, government / law enforcement investigation or other legal 
                                requirements; {'\n'}(ii) to assist in the prevention or detection of crime 
                                (subject in each case to applicable law); or {'\n'}(iii) to protect the safety of any person. </Text>
                        </Unorderedlist>
                        <Unorderedlist>
                                <Text>We may also share information: {'\n'}(i) if disclosure would mitigate our liability in
                                 an actual or threatened lawsuit;{'\n'} (ii) as necessary to protect our 
                                 legal rights and legal rights of our users, business partners or other
                                interested parties; {'\n'}(iii) to enforce our agreements with you; and 
                                {'\n'}(iv) to investigate, prevent, or take other action regarding illegal activity, suspected fraud or other wrongdoing.{'\n'}</Text>
                        </Unorderedlist>
                        <Text>By using the Service you consent to the transfer of your information
                             to the United States and/or to other countries for storage, 
                                processing and use by Findr in accordance with our Privacy Policy. {'\n'}</Text>
                        <Text>We may aggregate and/or anonymize information collected through the Service
                         so that the information does not identify you. We may use aggregated, anonymized, 
                         and other de-identified information for any purpose, including for research and 
                         marketing purposes, and our use and disclosure of such information is not subject 
                         to any restrictions under this Privacy Policy. {'\n'}</Text>
                         <Text style={styles.privacyHeader}>HOW WE PROTECT YOUR INFORMATION</Text>
                         <Text>We work hard to protect you from unauthorized access to or alteration, 
                            disclosure or destruction of your personal information. As with all technology 
                            companies, although we take steps to secure your information, we do not promise,
                            and you should not expect, that your personal information will always remain secure.{'\n'}</Text>
                        <Text>We regularly monitor our systems for possible vulnerabilities and attacks and
                             regularly review our information collection, storage and processing practices 
                             to update our physical, technical and organizational security measures.{'\n'}</Text>
                        <Text>We may suspend your use of all or part of the services without notice if 
                            we suspect or detect any breach of security. If you believe that your account
                             or information is no longer secure, please notify us immediately.</Text>
                        <Text style={styles.privacyHeader}>YOUR CHOICES ABOUT YOUR INFORMATION</Text>
                        <Text>You may, of course, decline to submit information through the Service,
                            in which case Findr may not be able to provide certain services to you. 
                            You may update or correct your account information and email preferences 
                            at any time by logging in to your account. </Text>
                        <Text style={styles.privacyHeader}>CHILDREN'S PRIVACY</Text>
                        <Text>Our services are restricted to users who are 13 years of age or
                            older. We do not permit users under the age of 13 on our platform and we
                            do not knowingly collect personal information from anyone under the age 
                            of 13. If you suspect that a user is under the age of 13, please use the
                            reporting mechanism available through the service.</Text>
                        <Text style={styles.privacyHeader}>PRIVACY POLICY CHANGES</Text>
                        <Text>Because we’re always looking for new and innovative ways to help you 
                            build meaningful connections, this policy may change over time. We will
                             notify you before any material changes take effect so that you have time 
                             to review the changes.{'\n'}</Text>
                    </ScrollView>
                </View>
                <Button mode="contained" style={styles.acceptButton}>
                    Accept
                </Button>
            </View>
        )
    }
}

export default Privacy;