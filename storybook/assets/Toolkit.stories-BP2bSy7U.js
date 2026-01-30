import{j as o}from"./iframe-CJaWlx9k.js";import{c as e}from"./plugin-HC6L5CqT.js";import{S as l}from"./Grid-CvrlVjPi.js";import{C as m}from"./ComponentAccordion-DCv6qjEo.js";import{w as a}from"./appWrappers-KXpf8wG0.js";import{T as i}from"./TemplateBackstageLogoIcon-CCaqY7Yx.js";import{I as s}from"./InfoCard-Dwr3nloC.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-CYNhPwzU.js";import"./componentData-DJazsba3.js";import"./useAnalytics-B9VoDArS.js";import"./useApp-C3Rn7vNb.js";import"./useRouteRef-DSloxSH6.js";import"./index-BQ0Bm2RY.js";import"./DialogTitle-Ddd7NJfh.js";import"./Modal-DA7gw75D.js";import"./Portal-CCaSbatU.js";import"./Backdrop-Br04yFLt.js";import"./Button-BIo1VJpq.js";import"./useObservable-Ci9nj0uo.js";import"./useIsomorphicLayoutEffect-DaQ9vgb_.js";import"./ExpandMore-C8_7pfNC.js";import"./AccordionDetails-rBd-wslk.js";import"./index-B9sM2jn7.js";import"./Collapse-Do9YA9sk.js";import"./useAsync-BIkYo0dn.js";import"./useMountedState-BX2n2ffy.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-Cz50hYBX.js";import"./ErrorBoundary-Tzl3QUgw.js";import"./ErrorPanel-B3gEy6QN.js";import"./WarningPanel-Bt3VBM0r.js";import"./MarkdownContent-BbMUo3g_.js";import"./CodeSnippet-7H2Sad9p.js";import"./Box-C7QC6pzn.js";import"./styled-CZ7JF9wM.js";import"./CopyTextButton-BT4ENnB_.js";import"./useCopyToClipboard-D8QOZa6n.js";import"./Tooltip-BdyP1fjK.js";import"./Popper-D3Zb46nS.js";import"./List-CG61H5Q6.js";import"./ListContext-BgC5EWvT.js";import"./ListItem-C89Oh5hh.js";import"./ListItemText-DiADD6kG.js";import"./LinkButton-5bxMHofQ.js";import"./Link-BT9-PDsb.js";import"./lodash-Czox7iJy.js";import"./CardHeader-C3-hJvDl.js";import"./Divider-iZOmm7wk.js";import"./CardActions-BgceOLG0.js";import"./BottomLink-Dm0y6uih.js";import"./ArrowForward-DYtCoeK4.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))],tags:["!manifest"]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
  return <Grid item xs={12} md={6}>
      <HomePageToolkit tools={Array(8).fill({
      url: '#',
      label: 'link',
      icon: <TemplateBackstageLogoIcon />
    })} />
    </Grid>;
}`,...r.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
  const ExpandedComponentAccordion = (props: any) => <ComponentAccordion expanded {...props} />;
  return <InfoCard title="Toolkit" noPadding>
      <Grid item>
        <HomePageToolkit title="Tools 1" tools={Array(8).fill({
        url: '#',
        label: 'link',
        icon: <TemplateBackstageLogoIcon />
      })} Renderer={ExpandedComponentAccordion} />
        <HomePageToolkit title="Tools 2" tools={Array(8).fill({
        url: '#',
        label: 'link',
        icon: <TemplateBackstageLogoIcon />
      })} Renderer={ComponentAccordion} />
        <HomePageToolkit title="Tools 3" tools={Array(8).fill({
        url: '#',
        label: 'link',
        icon: <TemplateBackstageLogoIcon />
      })} Renderer={ComponentAccordion} />
      </Grid>
    </InfoCard>;
}`,...t.parameters?.docs?.source}}};const uo=["Default","InAccordion"];export{r as Default,t as InAccordion,uo as __namedExportsOrder,co as default};
