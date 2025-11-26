import{j as o}from"./iframe-DXt6I_1q.js";import{c as e}from"./plugin-v6adl62a.js";import{S as l}from"./Grid-S6xSP1g4.js";import{C as m}from"./ComponentAccordion-BXxGvnLn.js";import{w as a}from"./appWrappers-BbpqoopC.js";import{T as i}from"./TemplateBackstageLogoIcon-BhHTj-6E.js";import{I as s}from"./InfoCard-CZWzg546.js";import"./preload-helper-D9Z9MdNV.js";import"./Plugin-DguzI5U9.js";import"./componentData-ErQLe4OM.js";import"./useAnalytics-CGIT0JTN.js";import"./useApp-Bi1KQAH_.js";import"./useRouteRef-CAgnkOiS.js";import"./index-kCs7zF-O.js";import"./DialogTitle-DEXlHuyv.js";import"./Modal-O3HFvYR5.js";import"./Portal-DOTL7Yad.js";import"./Backdrop-PRNJOzON.js";import"./Button-Bqv3NR6y.js";import"./useObservable-DTc_vT-Q.js";import"./useIsomorphicLayoutEffect-l4gsGf2N.js";import"./ExpandMore-CSLlRCsy.js";import"./AccordionDetails-BnUWlxaJ.js";import"./index-DnL3XN75.js";import"./Collapse-DtNym6qB.js";import"./useAsync-uNXDDhwP.js";import"./useMountedState-BEJ2TW9Z.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./CardContent-BwUEUqdM.js";import"./ErrorBoundary-Dn7kNKcq.js";import"./ErrorPanel-B33pLPVR.js";import"./WarningPanel-DQn25WOa.js";import"./MarkdownContent-BXxoLhhS.js";import"./CodeSnippet-CItDkStU.js";import"./Box-BQB-mg8-.js";import"./styled-Dla1Uw7W.js";import"./CopyTextButton-BSjmWnC0.js";import"./useCopyToClipboard-BoyifASt.js";import"./Tooltip-CCBqo9iV.js";import"./Popper-rfLbfelh.js";import"./List-PtSETj5l.js";import"./ListContext-C4_dHRNu.js";import"./ListItem-CNHhXRSS.js";import"./ListItemText-CaGb_JPi.js";import"./LinkButton-rg2HdNk0.js";import"./Link-CMkKbcZq.js";import"./lodash-CwBbdt2Q.js";import"./CardHeader-Cc8WUsGZ.js";import"./Divider-rqAQKIY3.js";import"./CardActions-DQw2Z0X8.js";import"./BottomLink--V4SW3M9.js";import"./ArrowForward-CdPzQ0qE.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
