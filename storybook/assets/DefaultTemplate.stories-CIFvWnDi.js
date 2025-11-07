import{j as t,T as p,c,C as l,m as i,a as d}from"./iframe-C4yti0TH.js";import{s as g,H as u}from"./plugin-BL8kxZNU.js";import{c as h}from"./api-BfuP0HRM.js";import{c as f}from"./catalogApiMock-Bb-xugnS.js";import{s as x}from"./api-DA5O3fCt.js";import{S as y}from"./SearchContext-CczJflgI.js";import{P as S}from"./Page-BaM5gg76.js";import{S as r}from"./Grid-v0xxfd_1.js";import{b as k,a as j,c as C}from"./plugin-DzdQwfcL.js";import{T as P}from"./TemplateBackstageLogo-flWOYf0w.js";import{T}from"./TemplateBackstageLogoIcon-cMs47Nlk.js";import{e as I}from"./routes-Dqa4L_BV.js";import{w as v}from"./appWrappers-CHKMDW6u.js";import{s as G}from"./StarredEntitiesApi-B9nCKC42.js";import{M as A}from"./MockStarredEntitiesApi-Du1ej0kb.js";import{I as B}from"./InfoCard-DPJdH_Et.js";import"./preload-helper-D9Z9MdNV.js";import"./index-BTMjwqrs.js";import"./Plugin-IDIj0Vlw.js";import"./componentData-CnWfJ3h2.js";import"./useAnalytics--K1VOgoc.js";import"./useApp-y9Jc7IOk.js";import"./useRouteRef-HPBHqWqn.js";import"./index-B-o6asHV.js";import"./ref-C0VTUPuL.js";import"./lodash-CwBbdt2Q.js";import"./useAsync-D8arkYRP.js";import"./useMountedState-Cru6FRlT.js";import"./DialogTitle-N20emC9L.js";import"./Modal-Bq63ThXv.js";import"./Portal-JPlxc26l.js";import"./Backdrop-CvNyeuNu.js";import"./Button-CYNcmEzy.js";import"./useObservable-arzc73Pi.js";import"./useIsomorphicLayoutEffect-CzIfcLC5.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./CardContent-Bf4mW7o7.js";import"./ErrorBoundary-BzulBN0z.js";import"./ErrorPanel-EUwm2tRb.js";import"./WarningPanel-f4sgKJ3Y.js";import"./ExpandMore-C2bx2cGu.js";import"./AccordionDetails-DTv3HEFi.js";import"./index-DnL3XN75.js";import"./Collapse-BxjtCAeZ.js";import"./MarkdownContent-Dh73zjai.js";import"./CodeSnippet-C8zNOjQI.js";import"./Box-a1543Axe.js";import"./styled-DNUHEHW0.js";import"./CopyTextButton-CW3FaXzD.js";import"./useCopyToClipboard-CdfTyMvr.js";import"./Tooltip-BSjhen_5.js";import"./Popper-BlfRkzWo.js";import"./List-BRXiU0XK.js";import"./ListContext-BOYwBhLf.js";import"./ListItem-Cb_9Twd1.js";import"./ListItemText-BWf0pAiq.js";import"./LinkButton-C9QcjCSf.js";import"./Link-Cz9gaJJo.js";import"./CardHeader-CjUFrut6.js";import"./Divider-CU5IM_SK.js";import"./CardActions-ClCDbtfI.js";import"./BottomLink-Ds2ntytz.js";import"./ArrowForward-JohorMon.js";const b=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],E=f({entities:b}),a=new A;a.toggleStarred("component:default/example-starred-entity");a.toggleStarred("component:default/example-starred-entity-2");a.toggleStarred("component:default/example-starred-entity-3");a.toggleStarred("component:default/example-starred-entity-4");const Wt={title:"Plugins/Home/Templates",decorators:[e=>v(t.jsx(t.Fragment,{children:t.jsx(p,{apis:[[h,E],[G,a],[x,{query:()=>Promise.resolve({results:[]})}],[c,new l({stackoverflow:{baseUrl:"https://api.stackexchange.com/2.2"}})]],children:t.jsx(e,{})})}),{mountedRoutes:{"/hello-company":g.routes.root,"/catalog/:namespace/:kind/:name":I}})]},H=i(e=>({searchBarInput:{maxWidth:"60vw",margin:"auto",backgroundColor:e.palette.background.paper,borderRadius:"50px",boxShadow:e.shadows[1]},searchBarOutline:{borderStyle:"none"}})),R=i(e=>({container:{margin:e.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),o=()=>{const e=H(),{svg:s,path:n,container:m}=R();return t.jsx(y,{children:t.jsx(S,{themeId:"home",children:t.jsx(d,{children:t.jsxs(r,{container:!0,justifyContent:"center",spacing:6,children:[t.jsx(k,{className:m,logo:t.jsx(P,{classes:{svg:s,path:n}})}),t.jsx(r,{container:!0,item:!0,xs:12,justifyContent:"center",children:t.jsx(u,{InputProps:{classes:{root:e.searchBarInput,notchedOutline:e.searchBarOutline}},placeholder:"Search"})}),t.jsxs(r,{container:!0,item:!0,xs:12,children:[t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(j,{})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(C,{tools:Array(8).fill({url:"#",label:"link",icon:t.jsx(T,{})})})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(B,{title:"Composable Section",children:t.jsx("div",{style:{height:370}})})})]})]})})})})};o.__docgenInfo={description:"",methods:[],displayName:"DefaultTemplate"};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`() => {
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
