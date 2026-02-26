import{j as t,Z as u,N as p,$ as g}from"./iframe-DGowiHGf.js";import{r as h}from"./plugin-Cq1waaBc.js";import{S as l,u as c,a as x}from"./useSearchModal-DZTrXsxu.js";import{s as S,M}from"./api-BueG7KL8.js";import{S as C}from"./SearchContext-DdNG_Tkm.js";import{B as m}from"./Button-C4wOTJ52.js";import{m as f}from"./makeStyles-BB1S9Pq6.js";import{D as j,a as y,b as B}from"./DialogTitle-CiPVIZUA.js";import{B as D}from"./Box-VCK17nNx.js";import{S as n}from"./Grid-DloVQjFg.js";import{S as I}from"./SearchType-DxD15NPT.js";import{L as G}from"./List-BJFCJqLc.js";import{H as R}from"./DefaultResultListItem-B2T9C2wY.js";import{w as k}from"./appWrappers-p3xbS_2N.js";import{SearchBar as v}from"./SearchBar-Ce3A5wmF.js";import{S as T}from"./SearchResult-Dfjzgs3_.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BY9D3o3T.js";import"./Plugin-B4iDCg1z.js";import"./componentData-2xDE9M5N.js";import"./useAnalytics-DYPlyL1E.js";import"./useApp-D0KGx7Le.js";import"./useRouteRef-ChyfzW1q.js";import"./index-DaxhahHe.js";import"./ArrowForward-D6uoZynP.js";import"./translation-BCxMnSbP.js";import"./Page-C3BiKnG7.js";import"./useMediaQuery-CqedWkQu.js";import"./Divider-hi0NCk2q.js";import"./ArrowBackIos-DhQKJPR9.js";import"./ArrowForwardIos-D9U6JC4k.js";import"./translation-CokFYFLZ.js";import"./lodash-Bt1FuOXC.js";import"./useAsync-D6ZggBHa.js";import"./useMountedState-BoYu2riY.js";import"./Modal-DsQyezOX.js";import"./Portal-SyAq80li.js";import"./Backdrop-YwX3ybcb.js";import"./styled-CW0ZllnF.js";import"./ExpandMore-D4mtaBX9.js";import"./AccordionDetails-M9tEoS0J.js";import"./index-B9sM2jn7.js";import"./Collapse-CvbY4nyw.js";import"./ListItem-tq9DsB-6.js";import"./ListContext-C2un48fJ.js";import"./ListItemIcon-D6YZvXsA.js";import"./ListItemText-Basmz87l.js";import"./Tabs-DQITOq27.js";import"./KeyboardArrowRight-Bw5KI0qR.js";import"./FormLabel-CsbtYoPV.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-CWZVLTam.js";import"./InputLabel-CNFqzEIC.js";import"./Select-_AdfifEc.js";import"./Popover-DqpwUeJY.js";import"./MenuItem-jGeMMxN9.js";import"./Checkbox-DtLUDaxr.js";import"./SwitchBase-Q1JEFfms.js";import"./Chip-kBH_KxXR.js";import"./Link-DvMGce1e.js";import"./index-ClVhZOfu.js";import"./useObservable-CWjn70R7.js";import"./useIsomorphicLayoutEffect-CwPtbaSy.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-CrSQh8VJ.js";import"./useDebounce-BdqnJGyK.js";import"./InputAdornment-DQVXn1Mp.js";import"./TextField-Cqj6EJpc.js";import"./useElementFilter-D0CuaEpt.js";import"./EmptyState-Cg0ctT4w.js";import"./Progress-BAyaxc8d.js";import"./LinearProgress-CP8axtCp.js";import"./ResponseErrorPanel-Dai1VuMf.js";import"./ErrorPanel-CelOcstS.js";import"./WarningPanel-DI90orEf.js";import"./MarkdownContent-D2WJUTsj.js";import"./CodeSnippet-Di0IjEa6.js";import"./CopyTextButton-DVNEFKMR.js";import"./useCopyToClipboard-BXawMXPt.js";import"./Tooltip-Lr-cB2mL.js";import"./Popper-OdyRH94b.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},lo={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>k(t.jsx(u,{apis:[[S,new M(b)]],children:t.jsx(C,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":h}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=f(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(j,{children:t.jsxs(D,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(p,{"aria-label":"close",onClick:a,children:t.jsx(g,{})})]})}),t.jsx(y,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(I.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(T,{children:({results:d})=>t.jsx(G,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(R,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(B,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
}`,...r.parameters?.docs?.source}}};const co=["Default","CustomModal"];export{r as CustomModal,e as Default,co as __namedExportsOrder,lo as default};
