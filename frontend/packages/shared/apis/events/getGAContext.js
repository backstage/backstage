import { getAllReactComponentAncestors } from 'shared/components/Error/util/react';

const getGAContext = el => {
  const componentStack = getAllReactComponentAncestors(el);

  const componentWithContext = componentStack.find(component => {
    return component.props && component.props.gacontext;
  });

  return componentWithContext ? componentWithContext.props.gacontext : 'NA';
};

export default getGAContext;
