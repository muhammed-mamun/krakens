package queue

import (
	"encoding/json"

	"github.com/nats-io/nats.go"
)

type NATSQueue struct {
	conn *nats.Conn
}

func NewNATSQueue(url string) (*NATSQueue, error) {
	conn, err := nats.Connect(url)
	if err != nil {
		return nil, err
	}

	return &NATSQueue{conn: conn}, nil
}

func (n *NATSQueue) Publish(subject string, data interface{}) error {
	bytes, err := json.Marshal(data)
	if err != nil {
		return err
	}
	return n.conn.Publish(subject, bytes)
}

func (n *NATSQueue) Subscribe(subject string, handler func([]byte)) (*nats.Subscription, error) {
	return n.conn.Subscribe(subject, func(msg *nats.Msg) {
		handler(msg.Data)
	})
}

func (n *NATSQueue) Close() {
	n.conn.Close()
}
