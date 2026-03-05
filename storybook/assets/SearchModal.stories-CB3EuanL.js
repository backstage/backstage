import{j as t,W as u,K as p,X as g}from"./iframe-B7rMUZLI.js";import{r as h}from"./plugin-BHBR59W4.js";import{S as l,u as c,a as x}from"./useSearchModal-DGt8bZlj.js";import{s as S,M}from"./api-etO2Y8jF.js";import{S as C}from"./SearchContext-Di6lPCma.js";import{B as m}from"./Button-DXWJM0Gq.js";import{m as f}from"./makeStyles-BbDOaNwq.js";import{D as j,a as y,b as B}from"./DialogTitle-DFLqBxJT.js";import{B as D}from"./Box-DE3k0g2W.js";import{S as n}from"./Grid-ChmRa1xb.js";import{S as I}from"./SearchType-ChXbstil.js";import{L as G}from"./List-NlkzeZDP.js";import{H as R}from"./DefaultResultListItem-CrVFuPf6.js";import{w as k}from"./appWrappers-mM7oUtDO.js";import{SearchBar as v}from"./SearchBar-CA9wHmOc.js";import{S as T}from"./SearchResult-ClJf57St.js";import"./preload-helper-PPVm8Dsz.js";import"./index-D92TwJAk.js";import"./Plugin-s2PLWXGa.js";import"./componentData-DAWR_M7H.js";import"./useAnalytics-KiNG90-s.js";import"./useApp-BRmPnhRt.js";import"./useRouteRef-DjWzg7WH.js";import"./index-CJOPKnnX.js";import"./ArrowForward-BzvddWTM.js";import"./translation-BrLn9P1W.js";import"./Page-CbKU7Z12.js";import"./useMediaQuery-BK_9emi-.js";import"./Divider-fyxZ8qXv.js";import"./ArrowBackIos-ClWhR6DH.js";import"./ArrowForwardIos-DcvSQBVM.js";import"./translation-fjc_1B7u.js";import"./lodash-DMrnViDb.js";import"./useAsync-BRfV-jtK.js";import"./useMountedState-DOMzvQnC.js";import"./Modal-BTIfo08e.js";import"./Portal-Gi_4ezMI.js";import"./Backdrop-BrIauvIN.js";import"./styled-rHipxG34.js";import"./ExpandMore-DzZiZ1ed.js";import"./AccordionDetails-BQq5yz58.js";import"./index-B9sM2jn7.js";import"./Collapse-Dg7I3X8s.js";import"./ListItem-DUvIrbAd.js";import"./ListContext-2sTnrhYf.js";import"./ListItemIcon-DsUV2Ms8.js";import"./ListItemText-C1Ml3ojI.js";import"./Tabs-CCEzxq0k.js";import"./KeyboardArrowRight-CMkV_v6v.js";import"./FormLabel-RrwRY4RP.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-DSKSapn-.js";import"./InputLabel-iYXI3wLC.js";import"./Select-2c4XyF4s.js";import"./Popover-QJoOcoVv.js";import"./MenuItem-D6nyI-Un.js";import"./Checkbox-B5d0gLRa.js";import"./SwitchBase-BcNLhgYQ.js";import"./Chip-CQHFAwl4.js";import"./Link-CkavcW4q.js";import"./index-YYjQiTXP.js";import"./useObservable-B5eTD8lt.js";import"./useIsomorphicLayoutEffect-DJkNW41X.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-DEtrzVUq.js";import"./useDebounce-ZjNFk9TX.js";import"./InputAdornment-BQ3_L2VJ.js";import"./TextField-CiY6h94g.js";import"./useElementFilter-DeSDUP2I.js";import"./EmptyState-C3cU5bkJ.js";import"./Progress-BlggY3-u.js";import"./LinearProgress-DpsLT1mW.js";import"./ResponseErrorPanel-36gA4Y67.js";import"./ErrorPanel-59tXLFlm.js";import"./WarningPanel-BGgx6ec1.js";import"./MarkdownContent-DIsMNpfj.js";import"./CodeSnippet-DRR23uxD.js";import"./CopyTextButton-__9njuTe.js";import"./useCopyToClipboard-BFdRLNsJ.js";import"./Tooltip-DJ88mzvg.js";import"./Popper-TzRORtoi.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},lo={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>k(t.jsx(u,{apis:[[S,new M(b)]],children:t.jsx(C,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":h}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=f(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(j,{children:t.jsxs(D,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(p,{"aria-label":"close",onClick:a,children:t.jsx(g,{})})]})}),t.jsx(y,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(I.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(T,{children:({results:d})=>t.jsx(G,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(R,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(B,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
