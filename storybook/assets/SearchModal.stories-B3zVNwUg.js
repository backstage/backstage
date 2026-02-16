import{j as t,W as u,K as p,X as g}from"./iframe-BtR5uFk3.js";import{r as h}from"./plugin-CrWn-09D.js";import{S as l,u as c,a as x}from"./useSearchModal-BJXtXAtR.js";import{s as S,M}from"./api-_RlUZ8bz.js";import{S as C}from"./SearchContext-JYczXqQ1.js";import{B as m}from"./Button-DxiZ5WmK.js";import{m as f}from"./makeStyles-BfJpy4Wy.js";import{D as j,a as y,b as B}from"./DialogTitle-CtcN1ws3.js";import{B as D}from"./Box-OUxpV5ZT.js";import{S as n}from"./Grid-BcwH-HFr.js";import{S as I}from"./SearchType-C80X9YVm.js";import{L as G}from"./List-CzkDasS3.js";import{H as R}from"./DefaultResultListItem-RZMacvnL.js";import{w as k}from"./appWrappers-DlnGKvuR.js";import{SearchBar as v}from"./SearchBar-D03hpqnC.js";import{S as T}from"./SearchResult-CPeDfCjO.js";import"./preload-helper-PPVm8Dsz.js";import"./index-L42oypQt.js";import"./Plugin-DhHLkVNo.js";import"./componentData-BeHMODne.js";import"./useAnalytics-B6wKgkMO.js";import"./useApp-5tv6egRH.js";import"./useRouteRef-CTcjT6i_.js";import"./index-BMej53MO.js";import"./ArrowForward-Bda00Pjq.js";import"./translation-C6-k3P0J.js";import"./Page-LDGytUon.js";import"./useMediaQuery-C2C2VCFU.js";import"./Divider-ZCHYHqdQ.js";import"./ArrowBackIos-Oi_D8i5a.js";import"./ArrowForwardIos-Bk_DjBEO.js";import"./translation-CeE4EFVa.js";import"./lodash-ZuVUN9Fn.js";import"./useAsync-DSbVnNaQ.js";import"./useMountedState-D9gb5SvK.js";import"./Modal-r2IX8849.js";import"./Portal-n2LDmCMW.js";import"./Backdrop-DGuN0itr.js";import"./styled-Dh4-ZHyx.js";import"./ExpandMore-BC9RFylZ.js";import"./AccordionDetails-BoWkno8W.js";import"./index-B9sM2jn7.js";import"./Collapse-RDSawrgb.js";import"./ListItem-CfCZyyBM.js";import"./ListContext-BRtoW0M1.js";import"./ListItemIcon-BnfPLGSp.js";import"./ListItemText-nCVBR7lx.js";import"./Tabs-DLYZPSVy.js";import"./KeyboardArrowRight-DijtUWZZ.js";import"./FormLabel-ClF7ms37.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-BsP7WsA4.js";import"./InputLabel-BbeoIDWB.js";import"./Select-hd7DIRPa.js";import"./Popover-9Iv1wX11.js";import"./MenuItem-baRw06mL.js";import"./Checkbox-DVCgS8i7.js";import"./SwitchBase-DjGWgaJ9.js";import"./Chip-CuYne6sC.js";import"./Link-CiYTYpxs.js";import"./index-DxzcshiO.js";import"./useObservable-D11eHV_a.js";import"./useIsomorphicLayoutEffect-CM9r8e0x.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-DtNk1poV.js";import"./useDebounce-C8AcKoVe.js";import"./InputAdornment-BFXGwdIN.js";import"./TextField-cDdcBFuF.js";import"./useElementFilter-BLLM9DBA.js";import"./EmptyState-DidmGvkU.js";import"./Progress-D3MtWAMC.js";import"./LinearProgress-D4Bxbsfv.js";import"./ResponseErrorPanel-CVfiXUTa.js";import"./ErrorPanel-BN9_BTb3.js";import"./WarningPanel-Wpl4i8Ix.js";import"./MarkdownContent-DcvoPket.js";import"./CodeSnippet-DwGCrwI4.js";import"./CopyTextButton-BiMr52YT.js";import"./useCopyToClipboard-D_DS-bMS.js";import"./Tooltip-BsjCemVc.js";import"./Popper-BZySTT6t.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},lo={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>k(t.jsx(u,{apis:[[S,new M(b)]],children:t.jsx(C,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":h}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=f(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(j,{children:t.jsxs(D,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(p,{"aria-label":"close",onClick:a,children:t.jsx(g,{})})]})}),t.jsx(y,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(I.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(T,{children:({results:d})=>t.jsx(G,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(R,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(B,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
