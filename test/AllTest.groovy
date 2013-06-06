import geb.Browser
import geb.junit4.GebReportingTest
import org.junit.Test
import org.junit.runner.RunWith
import org.junit.runners.JUnit4

@RunWith(JUnit4)
class AllTests extends GebReportingTest {
    def srcFolder = new File(".").absolutePath
    def tests = [
            'mpk.columnsTest.html',
            'mpk.columnsTest.moveCards.html',
            'mpk.DMTests.html',
            'mpk.serializer.html'
    ]

    @Test
    void shouldRunAllTheTests(){
        Browser.drive {
            tests.each { test ->
                go "file://$srcFolder/test/$test"
                assert $('#qunit-testresult span.failed').text() == '0'
            }
        }
    }

}