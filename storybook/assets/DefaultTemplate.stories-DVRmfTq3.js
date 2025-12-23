import{j as t,T as p,c,C as l,m as i,a as d}from"./iframe-Hw755TNi.js";import{s as g,H as u}from"./plugin-9mq8IABY.js";import{c as h}from"./api-BR9ls_JI.js";import{c as f}from"./catalogApiMock-DTmhu5ka.js";import{s as x}from"./api-BlXSYa10.js";import{S as y}from"./SearchContext-D4LIAA57.js";import{P as S}from"./Page-B8o7NAcn.js";import{S as r}from"./Grid-w98sXAXk.js";import{b as k,a as j,c as C}from"./plugin-BL2Fs7YY.js";import{T as P}from"./TemplateBackstageLogo-C5FVhK4m.js";import{T}from"./TemplateBackstageLogoIcon-CuxCzxcI.js";import{e as I}from"./routes-Dy7Yjwmj.js";import{w as v}from"./appWrappers-D03uvxZe.js";import{s as G}from"./StarredEntitiesApi-CnE2GfmM.js";import{M as A}from"./MockStarredEntitiesApi-Be-e-iqz.js";import{I as B}from"./InfoCard-kqX3XXCw.js";import"./preload-helper-PPVm8Dsz.js";import"./index-8CFES-Rb.js";import"./Plugin-BMqfvgOd.js";import"./componentData-BOwbR1Jz.js";import"./useAnalytics-CLuGYyUh.js";import"./useApp-DdUuBagy.js";import"./useRouteRef-BmYWNidK.js";import"./index-CMiNgydu.js";import"./ref-C0VTUPuL.js";import"./lodash-Y_-RFQgK.js";import"./useAsync-DhB8gEfG.js";import"./useMountedState-DdJ7HSpX.js";import"./DialogTitle-DJbOyMxK.js";import"./Modal-DYeoU8Cn.js";import"./Portal-BZ6RZj06.js";import"./Backdrop-0thaD7uc.js";import"./Button-CpMmzG9U.js";import"./useObservable-Bntv1Tee.js";import"./useIsomorphicLayoutEffect-VemboVK5.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-CYUX33L8.js";import"./ErrorBoundary-C546sKxy.js";import"./ErrorPanel-CQgjrtaw.js";import"./WarningPanel-BGdCoFxI.js";import"./ExpandMore-CG9kYvvb.js";import"./AccordionDetails-6Uenh_Cj.js";import"./index-B9sM2jn7.js";import"./Collapse-Cpllhes9.js";import"./MarkdownContent-C43gFO83.js";import"./CodeSnippet-8GoXIwx4.js";import"./Box-DcpjYi3J.js";import"./styled-qTtGNmm_.js";import"./CopyTextButton-8-jfuG_8.js";import"./useCopyToClipboard-DQJZpUYG.js";import"./Tooltip-BwBST4sz.js";import"./Popper-QpCwrVnW.js";import"./List-Z-bLSsG8.js";import"./ListContext-moCHcqFh.js";import"./ListItem-DwV3XkH8.js";import"./ListItemText-f-UryDTW.js";import"./LinkButton-CXrJu3G0.js";import"./Link-BYu3CTsd.js";import"./CardHeader-DYcL2J26.js";import"./Divider-BkC6drLy.js";import"./CardActions-_4wK1Jvd.js";import"./BottomLink-D76zrCEq.js";import"./ArrowForward-BgApEUXb.js";const b=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],E=f({entities:b}),a=new A;a.toggleStarred("component:default/example-starred-entity");a.toggleStarred("component:default/example-starred-entity-2");a.toggleStarred("component:default/example-starred-entity-3");a.toggleStarred("component:default/example-starred-entity-4");const Wt={title:"Plugins/Home/Templates",decorators:[e=>v(t.jsx(t.Fragment,{children:t.jsx(p,{apis:[[h,E],[G,a],[x,{query:()=>Promise.resolve({results:[]})}],[c,new l({stackoverflow:{baseUrl:"https://api.stackexchange.com/2.2"}})]],children:t.jsx(e,{})})}),{mountedRoutes:{"/hello-company":g.routes.root,"/catalog/:namespace/:kind/:name":I}})]},H=i(e=>({searchBarInput:{maxWidth:"60vw",margin:"auto",backgroundColor:e.palette.background.paper,borderRadius:"50px",boxShadow:e.shadows[1]},searchBarOutline:{borderStyle:"none"}})),R=i(e=>({container:{margin:e.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),o=()=>{const e=H(),{svg:s,path:n,container:m}=R();return t.jsx(y,{children:t.jsx(S,{themeId:"home",children:t.jsx(d,{children:t.jsxs(r,{container:!0,justifyContent:"center",spacing:6,children:[t.jsx(k,{className:m,logo:t.jsx(P,{classes:{svg:s,path:n}})}),t.jsx(r,{container:!0,item:!0,xs:12,justifyContent:"center",children:t.jsx(u,{InputProps:{classes:{root:e.searchBarInput,notchedOutline:e.searchBarOutline}},placeholder:"Search"})}),t.jsxs(r,{container:!0,item:!0,xs:12,children:[t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(j,{})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(C,{tools:Array(8).fill({url:"#",label:"link",icon:t.jsx(T,{})})})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(B,{title:"Composable Section",children:t.jsx("div",{style:{height:370}})})})]})]})})})})};o.__docgenInfo={description:"",methods:[],displayName:"DefaultTemplate"};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`() => {
  const classes = useStyles();
  const {
    svg,
    path,
    container
  } = useLogoStyles();
  return <SearchContextProvider>
      <Page themeId="home">
        <Content>
          <Grid container justifyContent="center" spacing={6}>
            <HomePageCompanyLogo className={container} logo={<TemplateBackstageLogo classes={{
            svg,
            path
          }} />} />
            <Grid container item xs={12} justifyContent="center">
              <HomePageSearchBar InputProps={{
              classes: {
                root: classes.searchBarInput,
                notchedOutline: classes.searchBarOutline
              }
            }} placeholder="Search" />
            </Grid>
            <Grid container item xs={12}>
              <Grid item xs={12} md={6}>
                <HomePageStarredEntities />
              </Grid>
              <Grid item xs={12} md={6}>
                <HomePageToolkit tools={Array(8).fill({
                url: '#',
                label: 'link',
                icon: <TemplateBackstageLogoIcon />
              })} />
              </Grid>
              <Grid item xs={12} md={6}>
                <InfoCard title="Composable Section">
                  {/* placeholder for content */}
                  <div style={{
                  height: 370
                }} />
                </InfoCard>
              </Grid>
            </Grid>
          </Grid>
        </Content>
      </Page>
    </SearchContextProvider>;
}`,...o.parameters?.docs?.source}}};const zt=["DefaultTemplate"];export{o as DefaultTemplate,zt as __namedExportsOrder,Wt as default};
