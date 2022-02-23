import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { useEffect, useState } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as api from '../../api';
import { PrimaryButton } from '../../components/Button';
import { HeaderContentGapSpacer, HeaderSpacer } from '../../components/Header/Header';
import { PageWrapper } from '../../components/layout/Common';
import { OrderCard } from '../../components/OrderCard/OrderCard';
import { OrdersTab, Status } from '../../components/Orders/OrdersTab';
import { Item, Tabs } from '../../components/Tabs';
import { useExchangeContract } from '../../hooks/useContracts';
import { Label } from '../../styles/typography';
import { checkIfDeadlinePassed } from '../../utils/time';
import { signMessage } from '../../web3/request';
import { HighlightText, SingleColumnPageContent } from './Style';
import { Request } from './types';

const OrdersPage = () => {
  const [requestsByUser, setRequestsByUser] = useState<Request[]>([]);
  const [requestsToUser, setRequestsToUser] = useState<Request[]>([]);
  const { account, library } = useWeb3React<Web3Provider>();
  const exchangeContract = useExchangeContract(true);
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate();
  const { executeRecaptcha } = useGoogleReCaptcha();

  useEffect(() => {
    const getRequests = async () => {
      if (account) {
        const userRequests = await api.userRequests(account);
        setRequestsByUser(userRequests.data);

        const creatorRequests = await api.creatorRequests(account);
        setRequestsToUser(creatorRequests.data);
        setLoaded(true);
      }
    };
    getRequests();
  }, [account]);

  const refund = async (request: Request) => {
    if (!executeRecaptcha) {
      toast.warn('Something has occured, Please refresh the page.');
      return;
    }

    try {
      const captchaToken = await executeRecaptcha('Refund');
      const messageToSign = 'I am initiating refund';
      const signed = await signMessage(library, account, messageToSign);
      const tx = await exchangeContract.refundRequest(request.creator, request.requestId);
      await tx.wait();

      await api.refund(
        {
          id: request.id,
          address: account || '',
          signed: signed,
          message: messageToSign,
        },
        captchaToken,
      );
      toast.success('Successfully refunded!');

      const updated = requestsByUser.map((req) => {
        if (req.id === request.id) {
          req.refunded = true;
        }
        return req;
      });
      setRequestsByUser(updated);
    } catch (err) {
      toast.error('Error initiating refund!');
    }
  };

  return (
    <>
      <PageWrapper>
        <HeaderSpacer />
        <HeaderContentGapSpacer />
        <SingleColumnPageContent>
          <Tabs aria-label="View received and purchased orders">
            <Item key="ordered" title="Ordered">
              <OrdersTab
                loaded={loaded}
                requests={requestsByUser}
                FallbackWhenNoRequests={() => (
                  <div style={{ textAlign: 'center', display: 'flex', marginBottom: 24, marginTop: 80, width: '100%' }}>
                    <div style={{ display: 'block', width: '100%' }}>
                      <Label style={{ marginBottom: '40px' }}>You haven't made any booking requests yet.</Label>
                      {/* <Description>Set up your creator profile to start receiving bookings.</Description> */}
                      <PrimaryButton
                        onPress={() => {
                          navigate(`/explore`);
                        }}
                        size="small"
                        width="small"
                        style={{ marginTop: 20, margin: 'auto' }}
                      >
                        Explore creators
                      </PrimaryButton>
                    </div>
                  </div>
                )}
              >
                {(requests) =>
                  requests.map((i, n) => (
                    <OrderCard key={i.id} request={i} isReceived={false}>
                      {i.delivered && (
                        <PrimaryButton
                          onPress={() => {
                            navigate(`/orders/${i.creator}/${i.requestId}`);
                          }}
                          size="small"
                          width="small"
                          style={{ marginTop: 20 }}
                        >
                          View clip
                        </PrimaryButton>
                      )}
                      {!i.delivered && !checkIfDeadlinePassed(i.created, i.deadline) && !i.refunded && (
                        <Status style={{ marginTop: 20 }}>PENDING</Status>
                      )}
                      {!i.delivered && checkIfDeadlinePassed(i.created, i.deadline) && !i.refunded && (
                        <PrimaryButton
                          size="small"
                          width="small"
                          variant="secondary"
                          style={{ marginTop: 20 }}
                          onPress={() => refund(i)}
                        >
                          Claim refund
                        </PrimaryButton>
                      )}
                      {!i.delivered && i.refunded && (
                        <>
                          <HighlightText style={{ marginTop: 10 }}>This order has been refunded.</HighlightText>
                        </>
                      )}
                    </OrderCard>
                  ))
                }
              </OrdersTab>
            </Item>
            <Item key="received" title="Received">
              <OrdersTab
                loaded={loaded}
                requests={requestsToUser}
                FallbackWhenNoRequests={() => (
                  <div style={{ textAlign: 'center', display: 'flex', marginBottom: 24, marginTop: 80, width: '100%' }}>
                    <div style={{ display: 'block', width: '100%' }}>
                      <Label style={{ marginBottom: '24px' }}>You haven't received any booking requests yet.</Label>
                      {/* <Description>Set up your creator profile to start receiving bookings.</Description> */}
                      {/* Note(jonathanng) - currently /orders is not accessible for noncreators */}
                    </div>
                  </div>
                )}
              >
                {(requests) =>
                  requests.map((i, n, f) => (
                    <OrderCard key={i.id} request={i} isReceived={true}>
                      {!i.delivered && !checkIfDeadlinePassed(i.created, i.deadline) && (
                        <PrimaryButton
                          onPress={() => {
                            navigate(`/orders/${i.creator}/${i.requestId}`);
                          }}
                          size="small"
                          width="small"
                          style={{ marginTop: 20 }}
                        >
                          Upload clip
                        </PrimaryButton>
                      )}
                      {!i.delivered && checkIfDeadlinePassed(i.created, i.deadline) && (
                        <Status style={{ marginTop: 20, minWidth: 160 }}>PAST DEADLINE</Status>
                      )}
                      {i.delivered && (
                        <PrimaryButton
                          onPress={() => {
                            navigate(`/orders/${i.creator}/${i.requestId}`);
                          }}
                          variant="secondary"
                          size="small"
                          width="small"
                          style={{ marginTop: 20 }}
                        >
                          View clip
                        </PrimaryButton>
                      )}
                    </OrderCard>
                  ))
                }
              </OrdersTab>
            </Item>
          </Tabs>
        </SingleColumnPageContent>
      </PageWrapper>
    </>
  );
};

export { OrdersPage };