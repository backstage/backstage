import{j as t,W as u,m as p,K as g,X as h}from"./iframe-IlkKTMMY.js";import{r as x}from"./plugin-Day3akRR.js";import{S as l,u as c,a as S}from"./useSearchModal-BButpW1B.js";import{s as M,M as C}from"./api-C5ncLYs0.js";import{S as f}from"./SearchContext-DsFrMdrw.js";import{B as m}from"./Button-DYBy8hOa.js";import{D as j,a as y,b as B}from"./DialogTitle-el08iSng.js";import{B as D}from"./Box-Co-CX5dU.js";import{S as n}from"./Grid-CGYs8N7L.js";import{S as I}from"./SearchType-BeLhAwZM.js";import{L as G}from"./List-CWjVqxD3.js";import{H as R}from"./DefaultResultListItem-Dp2wzvX6.js";import{w as k}from"./appWrappers-CcDlNuqG.js";import{SearchBar as v}from"./SearchBar-D7TMN6s6.js";import{S as T}from"./SearchResult-Bm7Fo-JS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-LHxiPZ-6.js";import"./Plugin-Tcicyjbj.js";import"./componentData-CwKMiNzT.js";import"./useAnalytics-BBLhO3cg.js";import"./useApp-YIfbik5w.js";import"./useRouteRef-DDI3s-Ei.js";import"./index-D1wY3pZr.js";import"./ArrowForward-F0zzskd5.js";import"./translation-Cr34ey9R.js";import"./Page-3NLlljAw.js";import"./useMediaQuery-BUDVBaP5.js";import"./Divider-BH0d_S5D.js";import"./ArrowBackIos-ClqfOVVp.js";import"./ArrowForwardIos-D3kj-ijN.js";import"./translation-DnmLiljo.js";import"./lodash-60wLm22K.js";import"./useAsync-0Ib7_0wU.js";import"./useMountedState-WoBaJtOj.js";import"./Modal-Cn4PMnDV.js";import"./Portal-WsTivW4Y.js";import"./Backdrop-k-VlHRPc.js";import"./styled-Bwl9pvyb.js";import"./ExpandMore-BHR5lqHP.js";import"./AccordionDetails-D3hWIUkC.js";import"./index-B9sM2jn7.js";import"./Collapse-Ih_HTaQA.js";import"./ListItem-SM0MND7k.js";import"./ListContext-CqKUV46p.js";import"./ListItemIcon-499a9_DQ.js";import"./ListItemText-Cme_dSwm.js";import"./Tabs-DNWvNmJ-.js";import"./KeyboardArrowRight-CDueFU-a.js";import"./FormLabel-aUwGFzON.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-Bz2omgVd.js";import"./InputLabel-B8NZnFap.js";import"./Select-2uEBJlAz.js";import"./Popover-CoR_2wpB.js";import"./MenuItem-UPK3t9b2.js";import"./Checkbox-CYhArEkI.js";import"./SwitchBase-DV4-EbE3.js";import"./Chip-7hc4YMSJ.js";import"./Link-CTXwvBoU.js";import"./useObservable-B0xKnDA5.js";import"./useIsomorphicLayoutEffect-FWqh6Dvt.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-wHBiM2KI.js";import"./useDebounce-CwBOar8Z.js";import"./InputAdornment-B3sjFvd5.js";import"./TextField-Dh-CDXcQ.js";import"./useElementFilter-BtvR_iJC.js";import"./EmptyState-KUybYxpo.js";import"./Progress-wQvt1JMl.js";import"./LinearProgress-BXl-B9Iy.js";import"./ResponseErrorPanel-I5Mp-wpa.js";import"./ErrorPanel-BvHv2sy6.js";import"./WarningPanel-Bh6C0KZr.js";import"./MarkdownContent-CO4vdiSe.js";import"./CodeSnippet-CKzvA7pM.js";import"./CopyTextButton-D2vWQiEu.js";import"./useCopyToClipboard-BnrSYYZL.js";import"./Tooltip-CtyCqi0f.js";import"./Popper-BekvFLxn.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},so={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>k(t.jsx(u,{apis:[[M,new C(b)]],children:t.jsx(f,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=p(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(j,{children:t.jsxs(D,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(g,{"aria-label":"close",onClick:a,children:t.jsx(h,{})})]})}),t.jsx(y,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(I.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(T,{children:({results:d})=>t.jsx(G,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(R,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(B,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
