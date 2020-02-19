import React from "react";
import { connect } from "react-redux";
import axios from "axios";
import {
  Container,
  Dimmer,
  Grid,
  Icon,
  Image,
  Item,
  Label,
  List,
  Loader,
  Message,
  Pagination,
  Segment,
} from "semantic-ui-react";
import { productListURL, addToCartURL } from "../constants";
import { fetchCart } from "../store/actions/cart";
import { authAxios, numberWithCommas } from "../utils";
import { endpoint } from "../constants"

class ProductList extends React.Component {
  state = {
    loading: false,
    error: null,
    data: [],
    pagination: {
      totalPage: 0,
      count: 0,
      limit: 16,
    }
  };

  componentDidMount() {
    this.setState({ loading: true });
    axios
      .get(productListURL)
      .then(res => {
        const { pagination } = this.state;
        const count = res.data.count
        const totalPage = Math.ceil(count / pagination.limit);
        pagination.count = count;
        pagination.totalPage = totalPage;
        this.setState({ data: res.data.results, loading: false, pagination: pagination });
      })
      .catch(err => {
        this.setState({ error: "Server is sleeping. Please wait a minute !!!", loading: false });
      });
  }

  handlePageChange = (e, { activePage }) => {
    const { pagination } = this.state;
    const limit = pagination.limit;
    const pageURL = `${endpoint}/products/?limit=${limit}&offset=${(activePage - 1) * limit}`
    this.fetchProductList(pageURL)
  }
  fetchProductList = (pageURL) => {
    this.setState({ loading: true });
    axios
      .get(pageURL)
      .then(res => {
        this.setState({ data: res.data.results, loading: false });
      })
      .catch(err => {
        this.setState({ error: "Server is sleeping. Please wait a minute !!!", loading: false });
      });
  }

  render() {
    const { data, error, loading, pagination } = this.state;
    return (
      <Container>
        {error && (
          <Message
            error
            header="There was some errors with your submission"
            content={JSON.stringify(error)}
          />
        )}
        {loading && (
          <Segment>
            <Dimmer active inverted>
              <Loader inverted>Loading</Loader>
            </Dimmer>
            <Image src="/images/wireframe/short-paragraph.png" />

          </Segment>
        )}
        <Grid relaxed columns={2}>
          <Grid.Row>
            {data.map(item => {
              return (
                <Grid.Column>
                  <Item.Group divided>
                    <Item key={item.id}>
                      <Item.Image src={item.image} />
                      <Item.Content>
                        <Item.Header
                          as="a"
                          onClick={() =>
                            this.props.history.push(`/products/${item.id}`)
                          }
                        >
                          <h4>{item.title}</h4>
                        </Item.Header>
                        <Item.Meta>
                          <span className="cinema">{item.category}</span>
                        </Item.Meta>
                        <Item.Extra>
                          {(item.discount_price != null) ?
                            <div>
                              <a className="ui tag label"><strong><strike>$ {numberWithCommas(item.price.toFixed(2))}</strike></strong></a>
                              <a className="ui green tag label"><strong>$ {numberWithCommas(item.discount_price.toFixed(2))}</strong></a>
                            </div>
                            :
                            <div>
                              <a className="ui tag label"><strong>$ {numberWithCommas(item.price.toFixed(2))}</strong></a>
                            </div>
                          }
                        </Item.Extra>
                      </Item.Content>
                    </Item>
                  </Item.Group>
                  <div class="ui horizontal divider"></div>
                </Grid.Column>
              );
            })}
          </Grid.Row>
        </Grid>
        <div className="ui centered">
          <Pagination
            onPageChange={this.handlePageChange}
            defaultActivePage={1}
            ellipsisItem={{ content: <Icon name='ellipsis horizontal' />, icon: true }}
            firstItem={{ content: <Icon name='angle double left' />, icon: true }}
            lastItem={{ content: <Icon name='angle double right' />, icon: true }}
            prevItem={{ content: <Icon name='angle left' />, icon: true }}
            nextItem={{ content: <Icon name='angle right' />, icon: true }}
            totalPages={pagination.totalPage}
          />
        </div>
      </Container>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    refreshCart: () => dispatch(fetchCart())
  };
};

export default connect(
  null,
  mapDispatchToProps
)(ProductList);
