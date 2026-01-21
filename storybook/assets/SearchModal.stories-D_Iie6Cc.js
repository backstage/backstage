import{j as t,m as u,I as p,b as g,T as h}from"./iframe-DfW0k9e4.js";import{r as x}from"./plugin-BPZzyoGP.js";import{S as l,u as c,a as S}from"./useSearchModal-Dhb0KTFz.js";import{B as m}from"./Button-Fr0OfS-w.js";import{a as M,b as C,c as f}from"./DialogTitle-CE2AHhUw.js";import{B as j}from"./Box-D0zAdjf6.js";import{S as n}from"./Grid-DOkM8E58.js";import{S as y}from"./SearchType-U7BuECzt.js";import{L as I}from"./List-B3BEM4nz.js";import{H as B}from"./DefaultResultListItem-u_jyTCc2.js";import{s as D,M as G}from"./api-BKW6umIp.js";import{S as R}from"./SearchContext-DPWQU3kL.js";import{w as T}from"./appWrappers-Bey6bAOs.js";import{SearchBar as k}from"./SearchBar-ClJ8cM0L.js";import{a as v}from"./SearchResult-BdFZDc68.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BmwIVKC2.js";import"./Plugin-CujPLxPN.js";import"./componentData-AJopfss2.js";import"./useAnalytics-BnjriHJi.js";import"./useApp-BXmyl95T.js";import"./useRouteRef-CckqiBtY.js";import"./index-Gw3tDiAb.js";import"./ArrowForward-Cz23y3ha.js";import"./translation-BjJZoS9j.js";import"./Page-BhP-FqYw.js";import"./useMediaQuery-DXFUOQHP.js";import"./Divider-CYGCiMiq.js";import"./ArrowBackIos-QMQRb7RN.js";import"./ArrowForwardIos-Dhdr9DpS.js";import"./translation-B8d1ecO8.js";import"./Modal-B6gsZuYb.js";import"./Portal-D7dEWwg8.js";import"./Backdrop-BGOjf9vo.js";import"./styled-CReYHJ7K.js";import"./ExpandMore-DgZ6UNBD.js";import"./useAsync-CE87cvV8.js";import"./useMountedState-qW-VDUVJ.js";import"./AccordionDetails-B314eioH.js";import"./index-B9sM2jn7.js";import"./Collapse-kvPWdbht.js";import"./ListItem-Bw1vw_JI.js";import"./ListContext-hwCl85Z0.js";import"./ListItemIcon-DmfVKYOa.js";import"./ListItemText-IHJkJ5se.js";import"./Tabs-DlscVWOO.js";import"./KeyboardArrowRight-BVOSgdjO.js";import"./FormLabel-C42yupdB.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-bhr_4F6w.js";import"./InputLabel-BBJyoD9Z.js";import"./Select-Br-btPzD.js";import"./Popover-DTsWRma1.js";import"./MenuItem-djppn1-H.js";import"./Checkbox-vtnuwgp9.js";import"./SwitchBase-ezBeDY-1.js";import"./Chip-BaYDP9CE.js";import"./Link-BloAuSmB.js";import"./lodash-DLuUt6m8.js";import"./useObservable-DVRVcpuV.js";import"./useIsomorphicLayoutEffect--dLzM9RT.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-DQzO1a0n.js";import"./useDebounce-Bn9MeNMY.js";import"./InputAdornment-C7RxqNsz.js";import"./TextField-DS4MfGtj.js";import"./useElementFilter-gRlUZ1N2.js";import"./EmptyState-IGN825jd.js";import"./Progress-6JfWN87n.js";import"./LinearProgress-nbKXLKzo.js";import"./ResponseErrorPanel-2IJNkJME.js";import"./ErrorPanel-BMIN-fu2.js";import"./WarningPanel-BP-y6z0y.js";import"./MarkdownContent-DX3OAbaQ.js";import"./CodeSnippet--VZdTbP8.js";import"./CopyTextButton-BDBeSRds.js";import"./useCopyToClipboard-DOwrP97-.js";import"./Tooltip-DzakseTW.js";import"./Popper-B4DyDbOp.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},so={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>T(t.jsx(h,{apis:[[D,new G(b)]],children:t.jsx(R,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=u(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(M,{children:t.jsxs(j,{className:o.titleContainer,children:[t.jsx(k,{className:o.input}),t.jsx(p,{"aria-label":"close",onClick:a,children:t.jsx(g,{})})]})}),t.jsx(C,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(y.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(v,{children:({results:d})=>t.jsx(I,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(B,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(f,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
  const { state, toggleModal } = useSearchModal();

  return (
    <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal} />
    </>
  );
};
`,...e.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const CustomModal = () => {
  const classes = useStyles();
  const { state, toggleModal } = useSearchModal();

  return (
    <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Custom Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal}>
        {() => (
          <>
            <DialogTitle>
              <Box className={classes.titleContainer}>
                <SearchBar className={classes.input} />

                <IconButton aria-label="close" onClick={toggleModal}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container direction="column">
                <Grid item>
                  <SearchType.Tabs
                    defaultValue=""
                    types={[
                      {
                        value: "custom-result-item",
                        name: "Custom Item",
                      },
                      {
                        value: "no-custom-result-item",
                        name: "No Custom Item",
                      },
                    ]}
                  />
                </Grid>
                <Grid item>
                  <SearchResult>
                    {({ results }) => (
                      <List>
                        {results.map(({ document }) => (
                          <div
                            role="button"
                            tabIndex={0}
                            key={\`\${document.location}-btn\`}
                            onClick={toggleModal}
                            onKeyPress={toggleModal}
                          >
                            <DefaultResultListItem
                              key={document.location}
                              result={document}
                            />
                          </div>
                        ))}
                      </List>
                    )}
                  </SearchResult>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions className={classes.dialogActionsContainer}>
              <Grid container direction="row">
                <Grid item xs={12}>
                  <SearchResultPager />
                </Grid>
              </Grid>
            </DialogActions>
          </>
        )}
      </SearchModal>
    </>
  );
};
`,...r.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
  const {
    state,
    toggleModal
  } = useSearchModal();
  return <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal} />
    </>;
}`,...e.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
  const classes = useStyles();
  const {
    state,
    toggleModal
  } = useSearchModal();
  return <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Custom Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal}>
        {() => <>
            <DialogTitle>
              <Box className={classes.titleContainer}>
                <SearchBar className={classes.input} />

                <IconButton aria-label="close" onClick={toggleModal}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container direction="column">
                <Grid item>
                  <SearchType.Tabs defaultValue="" types={[{
                value: 'custom-result-item',
                name: 'Custom Item'
              }, {
                value: 'no-custom-result-item',
                name: 'No Custom Item'
              }]} />
                </Grid>
                <Grid item>
                  <SearchResult>
                    {({
                  results
                }) => <List>
                        {results.map(({
                    document
                  }) => <div role="button" tabIndex={0} key={\`\${document.location}-btn\`} onClick={toggleModal} onKeyPress={toggleModal}>
                            <DefaultResultListItem key={document.location} result={document} />
                          </div>)}
                      </List>}
                  </SearchResult>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions className={classes.dialogActionsContainer}>
              <Grid container direction="row">
                <Grid item xs={12}>
                  <SearchResultPager />
                </Grid>
              </Grid>
            </DialogActions>
          </>}
      </SearchModal>
    </>;
}`,...r.parameters?.docs?.source}}};const io=["Default","CustomModal"];export{r as CustomModal,e as Default,io as __namedExportsOrder,so as default};
