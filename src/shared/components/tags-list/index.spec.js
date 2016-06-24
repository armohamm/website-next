import { expect } from 'chai';
import React from 'react';
import { render, findAllWithType } from '../../test-helper';
import TagsList from './';

describe('Compoonent: TagsList', () => {
  describe('#render', () => {
    let props;

    beforeEach(() => {
      props = {
        tags: ['react', 'red badger'],
      };
    });

    it('renders a list of tags', () => {
      const component = render(
        <TagsList tags={props.tags} />
      );
      const listItems = findAllWithType('li', component);

      expect(listItems.length).to.equal(2);

      listItems.forEach((element, index) => {
        const tag = props.tags[index];
        const link = element.props.children;

        expect(link.props.href).to.equal(`/tags/${tag}`);
        expect(link.props.title).to.equal(`Read more content related to "${tag}"`);
        expect(link.props.children).to.equal(tag);
      });
    });

    it('returns null when the tags array is empty', () => {
      const component = render(
        <TagsList tags={[]} />
      );

      expect(component).to.equal(null);
    });

    it('throws when the tags array or link path is omitted', () => {
      expect(() => render(
        <TagsList />
      )).to.throw();
    });
  });
});
